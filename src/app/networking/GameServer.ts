import * as net from 'net';
import { Nitro } from '../Nitro';
import { IncomingPacket } from '../packets';
import { GameClient } from './GameClient';
import { Server } from './Server';

export class GameServer extends Server<net.Server>
{
    constructor()
    {
        super('GameServer');
    }

    protected onInit(): void
    {
        this._server = new net.Server();

        this._server.on('listening', () => this.onServerListening());
        this._server.on('connection', socket => this.onServerConnection(socket));
        this._server.on('close', async () => await this.onServerClose());
        this._server.on('error', err => this.onServerError(err));
    }

    protected onDispose(): void
    {
        this._server.close();
    }

    private onServerListening(): void
    {
        this.logger.log(`Listening ${ this._ip }:${ this._port }`);
    }

    private onServerConnection(socket: net.Socket): void
    {
        if(!this.isDisposed && !this.isDisposing)
        {
            const client = new GameClient(socket);

            if(Nitro.config.logging.enabled && Nitro.config.logging.connections.game) this.logger.log(`New Connection => ${ client.uniqueId }`);

            socket.on('data', async data => await this.onSocketData(client, data));
            socket.on('close', async hadError => await this.onSocketClose(client, hadError));
            socket.on('error', err => this.onSocketError(client, err));
        }
    }

    private async onServerClose(): Promise<void>
    {
        this.logger.warn(`Server Closed`);
    }

    private onServerError(err: Error): void
    {
        this.logger.error(err.message || err, err.stack);
    }

    private async onSocketData(client: GameClient, data: Buffer): Promise<void>
    {
        try
        {
            const packets: IncomingPacket[] = [];

            const originalPacket        = new IncomingPacket(data);
            const originalPacketLength  = originalPacket.bytesLength;

            let packetLength    = originalPacket.packetLength + 4;
            let completedLength = 0;

            if(originalPacketLength > packetLength)
            {
                for(let i = 0; i < originalPacketLength; i += packetLength)
                {
                    const packet = new IncomingPacket(data.slice(i, i + packetLength));

                    if(packet.header !== 0) packets.push(packet);

                    packetLength    = packet.packetLength + 4;
                    completedLength = completedLength + packetLength;
                }

                if(completedLength === originalPacketLength) await client.processIncoming(...packets);
            }
            else
            {
                await client.processIncoming(originalPacket);
            }
        }

        catch(err)
        {
            client.logger.error(err.message || err, err.stack);
        }
    }

    private async onSocketClose(client: GameClient, hadError: boolean)
    {
        try
        {
            await client.dispose();

            if(Nitro.config.logging.enabled && Nitro.config.logging.connections.game) this.logger.log(`Closed Connection => ${ client.uniqueId }`);
        }

        catch(err)
        {
            client.logger.error(err.message || err, err.stack);
        }
    }

    private onSocketError(client: GameClient, err: Error)
    {
        client.logger.error(err.message || err, err.stack);
    }

    public listen(ip: string, port: number): void
    {
        this._ip    = ip;
        this._port  = port;

        this._server.listen(port, ip);
    }
}