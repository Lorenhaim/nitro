import { Logger } from '../utilities';

export abstract class Manager
{
    private _logger: Logger;

    protected _isLoaded: boolean;
    protected _isLoading: boolean;

    protected _isDisposed: boolean;
    protected _isDisposing: boolean;

    constructor(managerName: string, logger: Logger = null)
    {
        this._logger        = !(logger instanceof Logger) ? new Logger(managerName) : logger;

        this._isLoaded       = false;
        this._isLoading      = false;

        this._isDisposed     = false;
        this._isDisposing    = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading     = true;

            await this.onInit();

            this._isLoaded      = true;
            this._isLoading     = false;
            this._isDisposed    = false;

            this._logger.log(`Initalized`);
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing   = true;

            await this.onDispose();

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;

            this._logger.error(`Disposed`);
        }
    }

    public async reload(): Promise<void>
    {
        await this.dispose();
        await this.init();
    }

    protected abstract onInit(): void;

    protected abstract onDispose(): void;

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