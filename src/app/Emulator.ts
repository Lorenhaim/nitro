import { Connection, createConnection } from 'typeorm';
import { ConfigOptions, Logger } from './common';
import { Config } from './Config';
import { GameManager, GameScheduler } from './game';
import { NetworkManager } from './networking';

export class Emulator
{
    private static _database: Connection;

    private static _logger: Logger = new Logger('Emulator');
    
    private static _gameManager: GameManager;
    private static _gameScheduler: GameScheduler;
    private static _networkManager: NetworkManager;

    public static async bootstrap()
    {
        try
        {
            const timeStarted = Date.now();

            Emulator._logger.log(`Starting Nitro`);

            Emulator._database      = await createConnection();
            Emulator._gameManager   = new GameManager();
            Emulator._gameScheduler = new GameScheduler();

            await Emulator._gameManager.cleanup();
            await Emulator._gameManager.init();
            Emulator._gameScheduler.init();
            
            Emulator._networkManager = new NetworkManager();

            await Emulator._networkManager.init();
            await Emulator._networkManager.listen();

            Emulator.logger().log(`Started in ${ Date.now() - timeStarted }ms`);
        }

        catch(err)
        {
            Emulator._logger.error(err.message || err, err.stack);

            await Emulator.dispose();
        }
    }

    public static async dispose()
    {
        try
        {
            if(Emulator._gameManager) await Emulator._gameManager.dispose();
            if(Emulator._gameScheduler) await Emulator._gameScheduler.dispose();
            if(Emulator._networkManager) await Emulator._networkManager.dispose();

            if(Emulator._database && Emulator._database.isConnected) Emulator._database.close();
        }

        catch(err)
        {
            Emulator._logger.error(err.message || err, err.stack);
        }
    }

    public static async reboot()
    {
        try
        {
            await this.dispose();
            await this.bootstrap();
        }

        catch(err)
        {
            Emulator._logger.error(err.message || err, err.stack);
        }
    }

    public static database(): Connection
    {
        return Emulator._database;
    }

    public static logger(): Logger
    {
        return Emulator._logger;
    }

    public static get config(): ConfigOptions
    {
        return Config;
    }

    public static get gameManager(): GameManager
    {
        return Emulator._gameManager;
    }

    public static get gameScheduler(): GameScheduler
    {
        return Emulator._gameScheduler;
    }

    public static get networkManager(): NetworkManager
    {
        return Emulator._networkManager;
    }
}