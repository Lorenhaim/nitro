import { existsSync, lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import { Manager } from '../common';
import { Nitro } from '../Nitro';
import { PluginEvent } from './events';
import { NitroPlugin } from './NitroPlugin';
import { PluginConfig } from './PluginConfig';

export class PluginManager extends Manager
{
    private _plugins: NitroPlugin[];

    private _events: { event: typeof PluginEvent, handler: Function }[];

    constructor()
    {
        super('PluginManager');

        this._plugins   = [];
        this._events    = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadPlugins();
    }

    protected async onDispose(): Promise<void>
    {

    }

    public getPlugin(name: string): NitroPlugin
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

        return null;
    }

    public hasPlugin(name: string): boolean
    {
        return this.getPlugin(name) !== null;
    }

    public addPlugin(plugin: NitroPlugin): NitroPlugin
    {
        if(!(plugin instanceof NitroPlugin)) return;

        if(this.hasPlugin(plugin.name)) return;

        this._plugins.push(plugin);

        return plugin;
    }

    public registerEvent(event: typeof PluginEvent, handler: Function): void
    {
        this._events.push({ event, handler });
    }

    public async processEvent(event: PluginEvent): Promise<PluginEvent>
    {
        const totalEvents = this._events.length;

        if(!totalEvents) return null;

        for(let i = 0; i < totalEvents; i++)
        {
            const activeEvent = this._events[i];

            if(!activeEvent) continue;

            if(!(event instanceof activeEvent.event)) continue;

            await activeEvent.handler(event);

            if(!event.isCancelled) continue;

            return event;
        }

        return event;
    }

    private async loadPlugins(): Promise<void>
    {
        this._plugins = [];

        if(!existsSync(Nitro.config.game.plugins.path))
        {
            this.logger.error('Invalid plugin directory');

            return;
        }

        const files = readdirSync(Nitro.config.game.plugins.path);

        if(!files) return;

        const totalFiles = files.length;

        if(!totalFiles) return;

        for(let i = 0; i < totalFiles; i++)
        {
            const fileName = files[i];

            if(!fileName) continue;

            const path = join(Nitro.config.game.plugins.path, files[i]);

            if(!path) continue;

            const stat = lstatSync(path);

            if(!stat.isDirectory()) continue;

            const pluginConfigPath = join(path, 'NitroConfig.ts');

            if(!existsSync(pluginConfigPath)) continue;

            const pluginConfig: PluginConfig = require(pluginConfigPath).default;

            if(!pluginConfig) continue;

            const mainClass: any = pluginConfig.mainClass;

            if(!mainClass) continue;

            const instance: NitroPlugin = new mainClass();

            if(!instance) continue;

            await instance.init();

            if(instance.isLoaded) this._plugins.push(instance);
        }
    }
}