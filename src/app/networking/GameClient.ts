import { Socket as NetSocket } from 'net';
import { Nitro } from '../Nitro';
import { Incoming, Outgoing } from '../packets';
import { Client } from './Client';

export class GameClient extends Client<NetSocket>
{
    private _machineId: string;

    constructor(socket: NetSocket)
    {
        super(socket, socket.remoteAddress);

        this._machineId = null;
        this._user      = null;
    }

    protected async onDispose(): Promise<void>
    {
        if(this.isAuthenticated)
        {
            await this._user.connections.disposeGameClient(false);

            if(this._willDestoryUser) await Nitro.gameManager.userManager.removeUser(this._user.id);
        }

        if(!this._socket.destroyed) this._socket.destroy();
    }

    protected setIncomingClient(incoming: Incoming): void
    {
        incoming.setClient(this);
    }

    protected setOutgoingClient(outgoing: Outgoing): void
    {
        outgoing.setClient(this);
    }

    public write(bytes: Buffer): void
    {
        this._socket.write(bytes);
    }

    public get machineId(): string
    {
        return this._machineId;
    }

    public set machineId(machineId: string)
    {
        this._machineId = machineId;
    }
}