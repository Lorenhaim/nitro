import { randomBytes } from 'crypto';
import { Logger } from '../common';
import { Emulator } from '../Emulator';
import { User } from '../game';
import { Incoming, IncomingPacket, Outgoing, OutgoingPacket } from '../packets';

export abstract class Client<T>
{
    private _uniqueId: string;
    protected _socket: T;
    protected _ip: string;

    protected _logger: Logger;

    protected _user: User;
    protected _willDestoryUser: boolean;
    protected _pingCount: number;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(socket: T, ip: string)
    {
        this._uniqueId          = randomBytes(16).toString('hex');
        this._socket            = socket;
        this._ip                = ip;

        this._logger            = new Logger(this._uniqueId);

        this._user              = null;
        this._willDestoryUser   = true;
        this._pingCount         = 0;
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            await this.onDispose();

            this._isDisposed    = true;
            this._isDisposing   = false;
        }
    }

    public setUser(user: User): void
    {
        if(user instanceof User) this._user = user;
    }

    public async processIncoming(...incoming: IncomingPacket[]): Promise<void>
    {
        const packets = [ ...incoming ];

        if(packets)
        {
            const totalPackets = packets.length;

            if(totalPackets)
            {
                for(let i = 0; i < totalPackets; i++)
                {
                    const packet = packets[i];

                    const handler: any = Emulator.networkManager.packetManager().getHandler(packet.header);

                    if(handler)
                    {
                        const instance: Incoming = new handler();
                        
                        if(instance instanceof Incoming)
                        {
                            this.setIncomingClient(instance);

                            if(instance.authenticationRequired && !this.isAuthenticated) return;
                            
                            instance.setPacket(packet);

                            if(Emulator.config.logging.enabled && Emulator.config.logging.packets.incoming) this.logger.log(`IncomingEvent [${ packet.header }] => ${ instance.constructor.name }`);

                            await instance.process();
                        }
                    }
                    else
                    {
                        if(Emulator.config.logging.enabled && Emulator.config.logging.packets.unknown)  this.logger.warn(`IncomingEvent [${ packet.header }] => Unknown`);
                    }
                }
            }
        }
    }

    public processOutgoing(...outgoing: Outgoing[]): void
    {
        const composers = [ ...outgoing ];

        if(!composers) return;

        const totalComposers = composers.length;

        if(!totalComposers) return;
        
        for(let i = 0; i < totalComposers; i++)
        {
            const composer = composers[i];

            if(composer instanceof Outgoing)
            {
                this.setOutgoingClient(composer);

                const packet = composer.compose();

                if(packet instanceof OutgoingPacket)
                {
                    if(composer.isCancelled) continue;
                    
                    if(packet.isPrepared && !packet.isCancelled)
                    {
                        this.write(packet.buffer);

                        if(Emulator.config.logging.enabled && Emulator.config.logging.packets.outgoing) this.logger.log(`OutgoingComposer [${ composer.header }] => ${ composer.constructor.name }`);
                    }
                    else
                    {
                        if(Emulator.config.logging.enabled && Emulator.config.logging.packets.unprepared) this.logger.warn(`OutgoingComposer => ${ composer.constructor.name } => Packet unprepared`);
                    }
                }
                else
                {
                    if(Emulator.config.logging.enabled) this.logger.error(`Invalid Composer => ${ composer.constructor.name }`);
                }
            }
        }
    }

    protected abstract setIncomingClient(incoming: Incoming): void;

    protected abstract setOutgoingClient(outgoing: Outgoing): void;

    protected abstract write(buffer: Buffer): void;

    protected abstract async onDispose(): Promise<void>;

    public get uniqueId(): string
    {
        return this._uniqueId;
    }

    public get socket(): T
    {
        return this._socket;
    }

    public get ip(): string
    {
        return this._ip;
    }

    public get logger(): Logger
    {
        return this.isAuthenticated ? this._user.logger : this._logger;
    }

    public get user(): User
    {
        return this._user;
    }

    public get willDestroyUser(): boolean
    {
        return this._willDestoryUser;
    }
    
    public set willDestroyUser(value: boolean)
    {
        this._willDestoryUser = value;
    }

    public get isAuthenticated(): boolean
    {
        return this._user !== null;
    }

    public get pingCount(): number
    {
        return this._pingCount;
    }

    public set pingCount(count: number)
    {
        this._pingCount = count;
    }
}