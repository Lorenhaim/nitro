import { Logger } from '../common';
import { Nitro } from '../Nitro';
import { Incoming, IncomingHeader } from '../packets';
import { PluginEvent } from './events';

export abstract class NitroPlugin
{
    private _name: string;
    private _logger: Logger;

    protected _isLoaded: boolean;
    protected _isLoading: boolean;

    protected _isDisposed: boolean;
    protected _isDisposing: boolean;

    constructor(name: string)
    {
        this._name          = name;
        this._logger        = new Logger('NitroPlugin', name);

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async init(): Promise<void>
    {
        if(this._isLoaded || this._isLoading || this._isDisposing) return;
        
        this._isLoading     = true;
        
        await this.onInit();

        this._isLoaded      = true;
        this._isLoading     = false;
        this._isDisposed    = false;

        this._logger.log(`Initalized`);
    }

    public async dispose(): Promise<void>
    {
        if(this._isDisposed || this._isDisposing || this._isLoading) return;
        
        this._isDisposing   = true;

        await this.onDispose();

        this._isDisposed    = true;
        this._isDisposing   = false;
        this._isLoaded      = false;

        this._logger.error(`Disposed`);
    }

    protected abstract async onInit(): Promise<void>;

    protected abstract async onDispose(): Promise<void>;

    protected registerPacket(header: IncomingHeader, handler: typeof Incoming)
    {
        Nitro.packetManager.addHandler(header, handler);

        this._logger.log(`Registered IncomingEvent [${ header }]`);
    }

    protected registerEvent(event: typeof PluginEvent, handler: Function): void
    {
        Nitro.pluginManager.registerEvent(event, handler);
    }

    public get name(): string
    {
        return this._name;
    }

    public get logger(): Logger
    {
        return this._logger;
    }
    
    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get isDisposing(): boolean
    {
        return this._isDisposing;
    }
}