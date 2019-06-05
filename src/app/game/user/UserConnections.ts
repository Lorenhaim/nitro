import { Manager } from '../../common';
import { GameClient, SocketClient } from '../../networking';
import { Outgoing, OutgoingHeader } from '../../packets';
import { User } from './User';

export class UserConnections extends Manager
{
    private _user: User;

    private _gameClient: GameClient;
    private _socketClient: SocketClient;
    private _socketHeaders: OutgoingHeader[];
    
    constructor(user: User)
    {
        super('UserConnections', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._gameClient    = null;
        this._socketClient  = null;
        this._socketHeaders = [ OutgoingHeader.SECURITY_LOGOUT, OutgoingHeader.SYSTEM_CONFIG, OutgoingHeader.VALIDATOR, OutgoingHeader.SECURITY_REGISTER, OutgoingHeader.CLIENT_PING, OutgoingHeader.SECURITY_TICKET ];
    }

    protected async onInit(): Promise<void> {}

    protected async onDispose(): Promise<void>
    {
        if(this._gameClient)    await this._gameClient.dispose();
        if(this._socketClient)  await this._socketClient.dispose();
    }

    public processOutgoing(...outgoing: Outgoing[]): void
    {
        if(this._gameClient) this._gameClient.processOutgoing(...outgoing);

        if(this._socketClient)
        {
            const allowedOutgoing: Outgoing[] = [];

            const totalOutgoing = outgoing.length;

            if(totalOutgoing)
            {
                for(let i = 0; i < totalOutgoing; i++)
                {
                    const packet = outgoing[i];

                    if(!packet) continue;

                    if(this._socketHeaders.indexOf(packet.header) !== -1) continue;

                    allowedOutgoing.push(packet);
                }
            }

            if(allowedOutgoing.length) this._socketClient.processOutgoing(...allowedOutgoing);
        }
    }

    public async setGameClient(client: GameClient)
    {
        if(this._gameClient)
        {
            this._gameClient.willDestroyUser = false;

            await this._gameClient.dispose();
        }

        this._gameClient = client;

        if(this._socketClient)
        {
            this._gameClient.willDestroyUser    = false;
            this._socketClient.willDestroyUser  = false;
        }

        client.setUser(this._user);
    }

    public async disposeGameClient(runDisposer: boolean = true)
    {
        if(this._gameClient)
        {
            this._gameClient.willDestroyUser = this._socketClient ? false : this._gameClient.willDestroyUser;

            if(runDisposer) await this._gameClient.dispose();

            this._gameClient = null;

            if(this._socketClient) this._socketClient.willDestroyUser = true;
        }
    }

    public async setSocketClient(client: SocketClient)
    {
        if(this._socketClient)
        {
            this._socketClient.willDestroyUser = false;

            await this._socketClient.dispose();
        }

        this._socketClient = client;

        if(this._gameClient)
        {
            this._socketClient.willDestroyUser  = false;
            this._gameClient.willDestroyUser    = false;
        }

        client.setUser(this._user);
    }

    public async disposeSocketClient(runDisposer: boolean = true)
    {
        if(this._socketClient)
        {
            this._socketClient.willDestroyUser = this._gameClient ? false : this._socketClient.willDestroyUser;

            if(runDisposer) await this._socketClient.dispose();

            this._socketClient = null;

            if(this._gameClient) this._gameClient.willDestroyUser = true;
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get gameClient(): GameClient
    {
        return this._gameClient;
    }

    public get socketClient(): SocketClient
    {
        return this._socketClient;
    }

    public get isConnected(): boolean
    {
        return this._gameClient instanceof GameClient || this._socketClient instanceof SocketClient;
    }
}