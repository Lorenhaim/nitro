import { Connection, createConnection } from 'typeorm';
import { ConfigOptions, Logger } from './common';
import { GameManager, GameScheduler } from './game';
import { NetworkManager } from './networking';
import { PacketManager } from './packets';
import { PluginManager } from './plugin';

export class Emulator
{
    private static _timestampStarted: number;
    private static _database: Connection;

    private static _logger: Logger = new Logger('Emulator');
    
    private static _config: ConfigOptions;
    private static _gameManager: GameManager;
    private static _gameScheduler: GameScheduler;
    private static _packetManager: PacketManager;
    private static _pluginManager: PluginManager;
    private static _networkManager: NetworkManager;

    public static async bootstrap(config: ConfigOptions)
    {
        try
        {
            console.log();
            console.log(`       _   ___ __              `);
            console.log(`      / | / (_) /__________    `);
            console.log(`     /  |/ / / __/ ___/ __ \\  `);
            console.log(`    / /|  / / /_/ /  / /_/ /   `);
            console.log(`   /_/ |_/_/\\__/_/   \\____/  `);
            console.log(`   v0.0.1 by Billsonnn         `);
            console.log();
            
            if(!config)
            {
                Emulator._logger.error('Invalid Configuration');

                return await Emulator.dispose();
            }

            Emulator._config = config;

            Emulator._timestampStarted = Date.now();

            Emulator._logger.log(`Starting Nitro`);

            Emulator._database          = await createConnection();
            Emulator._gameManager       = new GameManager();
            Emulator._gameScheduler     = new GameScheduler();
            Emulator._packetManager     = new PacketManager();
            Emulator._pluginManager     = new PluginManager();

            await Emulator._gameManager.cleanup();
            await Emulator._gameManager.init();
            await Emulator._gameScheduler.init();
            await Emulator._pluginManager.init();

            Emulator._networkManager = new NetworkManager();

            await Emulator._networkManager.init();

            Emulator._networkManager.listen();

            Emulator.logger.log(`Started in ${ Date.now() - Emulator._timestampStarted }ms`);
        }

        catch(err)
        {
            Emulator.logger.error(err.message || err, err.stack);

            await Emulator.dispose();
        }
    }

    public static async dispose()
    {
        try
        {
            if(Emulator._gameManager) await Emulator._gameManager.dispose();
            if(Emulator._gameScheduler) await Emulator._gameScheduler.dispose();
            if(Emulator._packetManager) Emulator._packetManager = null;
            if(Emulator._pluginManager) await Emulator._pluginManager.dispose();
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
            await this.bootstrap(Emulator._config);
        }

        catch(err)
        {
            Emulator._logger.error(err.message || err, err.stack);
        }
    }

    public static get timestampStarted(): number
    {
        return Emulator._timestampStarted;
    }

    public static get database(): Connection
    {
        return Emulator._database;
    }

    public static get logger(): Logger
    {
        return Emulator._logger;
    }

    public static get config(): ConfigOptions
    {
        return Emulator._config;
    }

    public static get gameManager(): GameManager
    {
        return Emulator._gameManager;
    }

    public static get gameScheduler(): GameScheduler
    {
        return Emulator._gameScheduler;
    }

    public static get packetManager(): PacketManager
    {
        return Emulator._packetManager;
    }

    public static get pluginManager(): PluginManager
    {
        return Emulator._pluginManager;
    }

    public static get networkManager(): NetworkManager
    {
        return Emulator._networkManager;
    }
}