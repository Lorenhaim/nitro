import { Manager } from '../common';
import { Nitro } from '../Nitro';
import { GameServer } from './GameServer';
import { SocketServer } from './SocketServer';

export class NetworkManager extends Manager
{
    private _gameServer: GameServer;
    private _socketServer: SocketServer;

    constructor()
    {
        super('NetworkManager');

        this._gameServer    = Nitro.config.game.enabled ? new GameServer() : null;
        this._socketServer  = Nitro.config.web.enabled ? new SocketServer() : null;
    }

    public async onInit(): Promise<void>
    {
        if(this._gameServer)    this._gameServer.init();
        if(this._socketServer)  this._socketServer.init();
    }

    public listen(): void
    {
        if(this._gameServer)    this._gameServer.listen(Nitro.config.game.ip, Nitro.config.game.port);
        if(this._socketServer)  this._socketServer.listen(Nitro.config.web.ip, Nitro.config.web.port)
    }

    public async onDispose(): Promise<void>
    {
        if(this._gameServer)    await this._gameServer.dispose();
        if(this._socketServer)  await this._socketServer.dispose();
    }

    public gameServer(): GameServer
    {
        return this._gameServer;
    }

    public socketServer(): SocketServer
    {
        return this._socketServer;
    }
}