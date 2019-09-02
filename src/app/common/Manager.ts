import { Disposable } from './Disposable';
import { Logger } from './utilities';

export abstract class Manager extends Disposable
{
    private _logger: Logger;

    constructor(managerName: string, logger: Logger = null)
    {
        super();

        this._logger = !(logger instanceof Logger) ? new Logger(managerName) : logger;
    }

    public async reload(): Promise<void>
    {
        await this.dispose();
        await this.init();
    }

    public get logger(): Logger
    {
        return this._logger;
    }
}