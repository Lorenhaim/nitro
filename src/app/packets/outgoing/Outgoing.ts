import { GameClient, SocketClient } from '../../networking';
import { OutgoingHeader } from './OutgoingHeader';
import { OutgoingPacket } from './OutgoingPacket';

export abstract class Outgoing
{
    private _header: OutgoingHeader;
    private _packet: OutgoingPacket;
    private _isCancelled: boolean;

    private _client: GameClient | SocketClient;

    constructor(header: OutgoingHeader)
    {
        if(!header) throw new Error('invalid_header');

        this._header        = header;
        this._packet        = new OutgoingPacket(header);
        this._isCancelled   = false;

        this._client        = null;
    }

    public setClient(client: GameClient | SocketClient): void
    {
        this._client = client;
    }

    public cancel(): OutgoingPacket
    {
        this._packet.cancel();

        this._isCancelled = true;

        return this._packet;
    }

    public error(err: Error): void
    {
        if(this._client && this._client.logger) this._client.logger.error(`Outgoing => ${ this.packet.header } => ${ this.constructor.name } ${ err.message || err }`, err.stack);
    }

    public abstract compose(): OutgoingPacket;

    public get header(): OutgoingHeader
    {
        return this._header;
    }

    public get packet(): OutgoingPacket
    {
        return this._packet;
    }

    public get isCancelled(): boolean
    {
        return this._isCancelled;
    }

    public get client(): GameClient | SocketClient
    {
        return this._client;
    }
}