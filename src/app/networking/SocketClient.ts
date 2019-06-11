import * as WebSocket from 'ws';
import { Nitro } from '../Nitro';
import { Incoming, Outgoing } from '../packets';
import { Client } from './Client';

export class SocketClient extends Client<WebSocket>
{
    constructor(socket: WebSocket, ip: string)
    {
        super(socket, ip);

        this._user = null;
    }

    protected async onDispose(): Promise<void>
    {
        await this.logout();

        if(this._socket.readyState !== this._socket.CLOSED && this._socket.readyState !== this._socket.CLOSING) this._socket.close();
    }

    protected setIncomingClient(incoming: Incoming): void
    {
        incoming.setClient(this);
    }

    protected setOutgoingClient(outgoing: Outgoing): void
    {
        outgoing.setClient(this);
    }

    public async logout(): Promise<void>
    {
        if(this.isAuthenticated)
        {
            await this._user.connections.disposeSocketClient(false);

            if(this._willDestoryUser) await Nitro.gameManager.userManager.removeUser(this._user.id);
        }
    }

    protected write(bytes: Buffer): void
    {
        this._socket.send(bytes);
    }
}