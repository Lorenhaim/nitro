import { join } from 'path';
import { Connection, createConnection } from 'typeorm';
import { ConfigOptions, Logger } from './common';
import { GameManager, GameScheduler } from './game';
import { NetworkManager } from './networking';
import { PacketManager } from './packets';
import { PluginManager } from './plugin';

export class Nitro
{
    private static _timestampStarted: number;
    private static _database: Connection;

    private static _logger: Logger = new Logger('Nitro');
    
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
            console.log(`       _   ___ __`);
            console.log(`      / | / (_) /__________`);
            console.log(`     /  |/ / / __/ ___/ __ \\`);
            console.log(`    / /|  / / /_/ /  / /_/ /`);
            console.log(`   /_/ |_/_/\\__/_/   \\____/`);
            console.log(`   v0.0.1 by Billsonnn`);
            console.log();
            console.log(`   Thanks for using Nitro. To report bugs or issues`);
            console.log(`   join us on Discord: https://discord.gg/7etsMAs`);
            console.log();
            
            if(!config)
            {
                Nitro._logger.error('Invalid Configuration');

                return await Nitro.dispose();
            }

            Nitro._config = config;

            if(config.general.environment === 'development')
            {
                config.database.entities.push(join(__dirname, '/database/entities/*Entity.ts'));
            }
            else
            {
                config.database.entities.push(join(__dirname, '/database/entities/*Entity.js'));
            }

            Nitro._timestampStarted = Date.now();

            Nitro._logger.log(`Starting Nitro`);

            Nitro._database          = await createConnection(config.database);
            Nitro._gameManager       = new GameManager();
            Nitro._gameScheduler     = new GameScheduler();
            Nitro._packetManager     = new PacketManager();
            Nitro._pluginManager     = new PluginManager();

            await Nitro._gameManager.cleanup();
            await Nitro._gameManager.init();
            await Nitro._gameScheduler.init();
            await Nitro._pluginManager.init();

            Nitro._networkManager = new NetworkManager();

            await Nitro._networkManager.init();

            Nitro._networkManager.listen();

            Nitro.logger.log(`Started in ${ Date.now() - Nitro._timestampStarted }ms`);
        }

        catch(err)
        {
            Nitro.logger.error(err.message || err, err.stack);

            await Nitro.dispose();
        }
    }

    public static async dispose()
    {
        try
        {
            if(Nitro._gameManager) await Nitro._gameManager.dispose();
            if(Nitro._gameScheduler) await Nitro._gameScheduler.dispose();
            if(Nitro._packetManager) Nitro._packetManager = null;
            if(Nitro._pluginManager) await Nitro._pluginManager.dispose();
            if(Nitro._networkManager) await Nitro._networkManager.dispose();

            if(Nitro._database && Nitro._database.isConnected) Nitro._database.close();
        }

        catch(err)
        {
            Nitro._logger.error(err.message || err, err.stack);
        }
    }

    public static async reboot()
    {
        try
        {
            await this.dispose();
            await this.bootstrap(Nitro._config);
        }

        catch(err)
        {
            Nitro._logger.error(err.message || err, err.stack);
        }
    }

    public static get timestampStarted(): number
    {
        return Nitro._timestampStarted;
    }

    public static get database(): Connection
    {
        return Nitro._database;
    }

    public static get logger(): Logger
    {
        return Nitro._logger;
    }

    public static get config(): ConfigOptions
    {
        return Nitro._config;
    }

    public static get gameManager(): GameManager
    {
        return Nitro._gameManager;
    }

    public static get gameScheduler(): GameScheduler
    {
        return Nitro._gameScheduler;
    }

    public static get packetManager(): PacketManager
    {
        return Nitro._packetManager;
    }

    public static get pluginManager(): PluginManager
    {
        return Nitro._pluginManager;
    }

    public static get networkManager(): NetworkManager
    {
        return Nitro._networkManager;
    }
}