import { Logger } from '../common';

export abstract class Server<T>
{
    protected _server: T;

    protected _ip: string;
    protected _port: number;

    private _logger: Logger;

    private _isLoading: boolean;
    private _isLoaded: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(serverName: string)
    {
        this._logger = new Logger(serverName);

        this._ip    = null;
        this._port  = null;
    }

    public init(): void
    {
        if(!this._isLoaded && !this._isLoading)
        {
            this._isLoading = true;

            this.onInit();

            this._isLoaded   = true;
            this._isLoading  = false;

            this._logger.log(`Initalized`);
        }
    }

    public dispose(): void
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            this.onDispose();

            this._isDisposed     = true;
            this._isDisposing    = false;

            this._logger.error(`Disposed`);
        }
    }

    protected abstract onInit(): void;

    protected abstract onDispose(): void;

    public abstract listen(ip: string, port: number): void;

    public get server(): T
    {
        return this._server;
    }

    public logger(): Logger
    {
        return this._logger;
    }

    public get isLoaded(): boolean
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