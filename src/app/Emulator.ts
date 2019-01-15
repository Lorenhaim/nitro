import { Connection, createConnection } from 'typeorm';
import { Logger, Config } from './common';
import { GameManager } from './game';
import { GameServer } from './networking';

export class Emulator
{
    private static _database: Connection;
    private static _config: Config;
    private static _gameManager: GameManager;
    private static _gameServer: GameServer;

    public static async bootstrap()
    {
        try
        {
            Logger.writeLine(`Starting HabboAPI`);

            Emulator._database      = await createConnection();
            Emulator._config        = new Config();

            await Emulator.config().loadConfig();

            Emulator._gameServer    = new GameServer();
            Emulator._gameManager   = new GameManager();

            await Emulator.gameManager().init();
            await Emulator.gameServer().init();

            Logger.writeLine(`Emulator -> Ready`);

            await Emulator.gameServer().listen(Emulator.config().getString('emulator.ip', '0.0.0.0'), Emulator.config().getNumber('emulator.port', 1242));
        }

        catch(err)
        {
            Logger.writeError(err.message || err);
        }
    }

    public static async dispose()
    {
        try
        {
            Logger.writeLine(`Disposing HabboAPI`);

            await Emulator._gameManager.dispose();

            Emulator.gameServer().socketServer().close();

            Logger.writeLine(`Emulator -> Disposed`);
        }

        catch(err)
        {
            Logger.writeError(err.message || err);
        }
    }

    public static database(): Connection
    {
        return Emulator._database;
    }

    public static config(): Config
    {
        return Emulator._config;
    }

    public static gameManager(): GameManager
    {
        return Emulator._gameManager;
    }

    public static gameServer(): GameServer
    {
        return Emulator._gameServer;
    }
}