import { Manager } from '../common';
import { PluginEvent } from './events';
import { NitroPlugin } from './NitroPlugin';

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

    }

    protected async onDispose(): Promise<void>
    {
        while(this._plugins.length)
        {
            const plugin = this._plugins.shift();

            if(!plugin) continue;

            await plugin.dispose();
        }

        this._events = [];
    }

    public getPlugin<T extends NitroPlugin>(plugin: { new(): T }): T
    {
        if(!plugin) return;

        const totalPlugins = this._plugins.length;

        if(!totalPlugins) return null;

        for(let i = 0; i < totalPlugins; i++)
        {
            const activePlugin = this._plugins[i];

            if(!activePlugin) continue;

            if(!(activePlugin instanceof plugin)) continue;

            return activePlugin;
        }

        return null;
    }

    public hasPlugin<T extends NitroPlugin>(plugin: { new(): T }): boolean
    {
        return this.getPlugin(plugin) !== null;
    }

    public async registerPlugin<T extends NitroPlugin>(plugin: { new(): T }): Promise<T>
    {
        if(!plugin) return null;

        const activePlugin = this.getPlugin(plugin);

        if(activePlugin) return activePlugin;

        const instance: T = new plugin();

        if(!(instance instanceof NitroPlugin)) return null;

        await instance.init();

        this._plugins.push(instance);

        return instance;
    }

    public registerEvent(event: Function, handler: Function): void
    {
        if(!event || !handler) return null;

        this._events.push({ event: <any> event, handler });

        this.logger.log(`Registered: ${ event.name } => ${ handler.name }`);
    }

    public async processEvent<T>(event: T): Promise<T>
    {
        if(!(event instanceof PluginEvent)) return null;

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
}