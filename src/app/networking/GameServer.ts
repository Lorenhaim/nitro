import { Server } from 'net';

import { Emulator } from '../Emulator';
import { Logger } from '../common';
import { User } from '../game';

import { Client } from './Client';
import { PacketManager } from '../packets';

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
            const user: User = new User(new Client(socket));

            socket.on('data', async data =>
            {
                try
                {
                    await this._packetManager.processPacket(user, data);
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