import { Server } from 'net';

import { Emulator } from '../Emulator';
import { Logger } from '../common';
import { User } from '../game';

import { Client } from './Client';
import { PacketManager, IncomingPacket, Incoming } from '../packets';

export class GameServer
{
    private _socketServer: Server;
    private _packetManager: PacketManager;

    constructor()
    {
        this._packetManager = new PacketManager();
    }

    public async init(): Promise<boolean>
    {
        this._socketServer = new Server(async socket =>
        {
            const user: User = new User(null, new Client(socket));

            socket.on('data', async data =>
            {
                try
                {
                    const packets: IncomingPacket[] = [];

                    const originalPacket        = new IncomingPacket(data);
                    const originalBufferLength  = originalPacket.bufferLength;

                    let packetLength    = originalPacket.packetLength + 4;
                    let completedLength = 0;

                    if(originalBufferLength > packetLength)
                    {
                        for(let i = 0; i < originalBufferLength; i += packetLength)
                        {
                            const packet = new IncomingPacket(data.slice(i, i + packetLength));

                            if(packet.header !== 0) packets.push(packet);

                            packetLength    = packet.packetLength + 4;
                            completedLength = completedLength + packetLength;
                        }

                        if(completedLength === originalBufferLength)
                        {
                            const totalPackets = packets.length;
                            
                            for(let i = 0; i < totalPackets; i++) await this._packetManager.processPacket(user, packets[i]);
                        }
                    }
                    else
                    {
                        await this._packetManager.processPacket(user, originalPacket);
                    }
                }

                catch(err)
                {
                    Logger.writeError(`Packet Error -> ${ err.message || err }`);
                }
            });

            socket.on('close', async hadError =>
            {
                try
                {
                    if(user.isAuthenticated) await Emulator.gameManager().userManager().removeUser(user.userId);
                }

                catch(err)
                {
                    Logger.writeError(`Socket Close Error -> ${ err.message || err }`);
                }
            });

            socket.on('error', err => socket.destroy());
        });

        this._socketServer.on('listening', () =>
        {
            Logger.writeLine(`GameServer -> Listening`);
        });

        return Promise.resolve(true);
    }

    public listen(ip: string, port: number): Promise<boolean>
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                this._socketServer.listen(port, ip, () => resolve(true));
            }

            catch(err)
            {
                reject(err);
            }
        });
    }

    public socketServer(): Server
    {
        return this._socketServer;
    }

    public packetManager(): PacketManager
    {
        return this._packetManager;
    }
}