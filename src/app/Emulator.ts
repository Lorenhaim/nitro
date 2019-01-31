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

            Emulator._database  = await createConnection();
            Emulator._config    = new Config();

            await Emulator.config().loadConfig();

            Emulator._gameManager = new GameManager();

            await Emulator.gameManager().cleanup();
            await Emulator.gameManager().init();

            if(Emulator.gameManager().isReady)
            {
                Emulator._gameServer = new GameServer();

                await Emulator.gameServer().init();

                await Emulator.gameServer().listen(Emulator.config().getString('emulator.ip', '0.0.0.0'), Emulator.config().getNumber('emulator.port', 1242));
            }
            else
            {
                throw new Error('something went wrong');
            }
        }

        catch(err)
        {
            Logger.writeError(err.message || err);

            await Emulator.dispose();
        }
    }

    public static async dispose()
    {
        try
        {
            Logger.writeLine(`Disposing HabboAPI`);

            if(Emulator._gameManager) await Emulator._gameManager.dispose();
            if(Emulator._gameServer && Emulator) Emulator.gameServer().socketServer().close();

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