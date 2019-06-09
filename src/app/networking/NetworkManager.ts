import { Manager } from '../common/interfaces/Manager';
import { Emulator } from '../Emulator';
import { GameServer } from './GameServer';
import { SocketServer } from './SocketServer';

export class NetworkManager extends Manager
{
    private _gameServer: GameServer;
    private _socketServer: SocketServer;

    constructor()
    {
        super('NetworkManager');

        this._gameServer    = Emulator.config.game.enabled ? new GameServer() : null;
        this._socketServer  = Emulator.config.web.enabled ? new SocketServer() : null;
    }

    public async onInit(): Promise<void>
    {
        if(this._gameServer)    this._gameServer.init();
        if(this._socketServer)  this._socketServer.init();
    }

    public listen(): void
    {
        if(this._gameServer)    this._gameServer.listen(Emulator.config.game.ip, Emulator.config.game.port);
        if(this._socketServer)  this._socketServer.listen(Emulator.config.web.ip, Emulator.config.web.port)
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