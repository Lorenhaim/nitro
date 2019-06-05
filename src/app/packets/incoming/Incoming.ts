import { GameClient, SocketClient } from '../../networking';
import { IncomingPacket } from './IncomingPacket';

export abstract class Incoming
{
    private _client: GameClient | SocketClient;
    private _packet: IncomingPacket;

    public setPacket(packet: IncomingPacket): void
    {
        this._packet = packet;
    }

    public setClient(client: GameClient | SocketClient): void
    {
        this._client = client;
    }

    public error(err: any)
    {
        if(this._client && this._client.logger) this._client.logger.error(`Incoming => ${ this.packet.header } => ${ this.constructor.name } ${ err.message || err }`, err.stack);
    }

    public abstract async process(): Promise<void>;

    public get client(): GameClient | SocketClient
    {
        return this._client;
    }

    public get packet(): IncomingPacket
    {
        return this._packet;
    }

    public get authenticationRequired(): boolean
    {
        return false;
    }

    public get guestOnly(): boolean
    {
        return false;
    }

    public get permissionRequired(): string[]
    {
        return [];
    }
}