import * as express from 'express';
import { createServer as createHttpServer, IncomingMessage, Server as HttpServer } from 'http';
import * as ws from 'ws';
import { Nitro } from '../Nitro';
import { IncomingPacket } from '../packets';
import { Server } from './Server';
import { SocketClient } from './SocketClient';

export class SocketServer extends Server<ws.Server>
{
    private _expressApp: any;
    private _webServer: HttpServer;

    constructor()
    {
        super('SocketServer');
    }

    protected onInit(): void
    {
        this._expressApp = express();

        if(Nitro.config.web.express.cors)
        {
            this._expressApp.use((req: any, res: any, next: any) =>
            {
                res.header("Access-Control-Allow-Origin", Nitro.config.web.express.allowedUrl);
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                next();
            });
        }

        this._expressApp.use(express.static('./public'));

        this._webServer = createHttpServer(this._expressApp);
        
        this._server = new ws.Server({ server: this._webServer });

        this._server.on('listening', () => this.onServerListening());
        this._server.on('connection', (socket, request) => this.onServerConnection(socket, request));
        this._server.on('error', err => this.onServerError(err));
    }

    protected onDispose(): void
    {
        this._server.close();
        this._webServer.close();
    }

    private onServerListening()
    {
        this.logger().log(`Listening ${ this._ip }:${ this._port }`);
    }

    protected onServerConnection(socket: ws, request: IncomingMessage)
    {
        if(!this.isDisposed && !this.isDisposing)
        {
            let ip = null;

            if(request && request.headers['x-forwarded-for'])
            {
                ip = request.headers['x-forwarded-for'].toString();
            }
            else
            {
                ip = request.connection.remoteAddress;
            }

            if(ip)
            {
                const client = new SocketClient(socket, ip);

                if(Nitro.config.logging.enabled && Nitro.config.logging.connections.web) this.logger().log(`New Connection => ${ client.uniqueId }`);

                socket.on('message', async data => await this.onSocketData(client, data));
                socket.on('close', async code => await this.onSocketClose(client, code));
                socket.on('error', err => this.onSocketError(client, err));
            }
        }
    }

    private onServerError(err: Error)
    {
        this.logger().error(err.message || err, err.stack);
    }

    private async onSocketData(client: SocketClient, data: ws.Data)
    {
        try
        {
            const packets: IncomingPacket[] = [];

            const originalPacket        = new IncomingPacket(<Buffer> data);
            const originalPacketLength  = originalPacket.bytesLength;

            let packetLength    = originalPacket.packetLength + 4;
            let completedLength = 0;

            if(originalPacketLength > packetLength)
            {
                for(let i = 0; i < originalPacketLength; i += packetLength)
                {
                    const packet = new IncomingPacket(<Buffer> data.slice(i, i + packetLength));

                    if(packet.header !== 0) packets.push(packet);

                    packetLength    = packet.packetLength + 4;
                    completedLength = completedLength + packetLength;
                }

                if(completedLength === originalPacketLength) await client.processIncoming(...packets);
            }
            else await client.processIncoming(originalPacket);
        }

        catch(err)
        {
            client.logger.error(err.message || err, err.stack)
        }
    }

    private async onSocketClose(client: SocketClient, code: number)
    {
        try
        {
            await client.dispose();

            if(Nitro.config.logging.enabled && Nitro.config.logging.connections.web) this.logger().log(`Closed Connection => ${ client.uniqueId }`);
        }

        catch(err)
        {
            client.logger.error(err.message || err, err.stack);
        }
    }

    private onSocketError(client: SocketClient, err: Error)
    {
        client.logger.error(err.message || err, err.stack);
    }

    public listen(ip: string, port: number): void
    {
        this._ip    = ip;
        this._port  = port;
        
        this._webServer.listen(port, ip);
    }
}