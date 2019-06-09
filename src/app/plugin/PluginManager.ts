import { existsSync, lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import { Manager } from '../common';
import { Emulator } from '../Emulator';
import { Plugin } from './Plugin';

export class PluginManager extends Manager
{
    private _plugins: Plugin[];

    constructor()
    {
        super('PluginManager');
    }

    public getPlugin(name: string): Plugin
    {
        if(!name) return null;

        const totalPlugins = this._plugins.length;

        if(!totalPlugins) return null;

        for(let i = 0; i < totalPlugins; i++)
        {
            const plugin = this._plugins[i];

            if(!plugin) continue;

            if(plugin.name !== name) continue;

            return plugin;
        }
    }

    public hasPlugin(name: string): boolean
    {
        return this.getPlugin(name) !== null;
    }

    public addPlugin(plugin: Plugin): Plugin
    {
        if(!(plugin instanceof Plugin)) return;

        if(this.hasPlugin(plugin.name)) return;

        this._plugins.push(plugin);

        return plugin;
    }

    protected async onInit(): Promise<void>
    {
        await this.loadPlugins();
    }

    protected async onDispose(): Promise<void>
    {

    }

    private async loadPlugins(): Promise<void>
    {
        this._plugins = [];

        if(!existsSync(Emulator.config.game.plugins.path))
        {
            this.logger.error('Invalid plugin directory');

            return;
        }

        const files = readdirSync(Emulator.config.game.plugins.path);

        if(!files) return;

        const totalFiles = files.length;

        if(!totalFiles) return;

        for(let i = 0; i < totalFiles; i++)
        {
            const fileName = files[i];

            if(!fileName) continue;

            const path = join(Emulator.config.game.plugins.path, files[i]);

            if(!path) continue;

            const stat = lstatSync(path);

            if(!stat.isDirectory()) continue;
            
            const pluginName = fileName.charAt(0).toUpperCase() + fileName.slice(1) + 'Plugin';

            const mainClass = join(path, `${ pluginName }.ts`);

            if(!existsSync(mainClass)) continue;

            const plugin = require(mainClass).default;

            if(!plugin) continue;

            const instance = new plugin();

            await instance.init();
        }
    }
}