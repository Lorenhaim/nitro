export abstract class Task
{
    private _name: string;
    private _isRunning: boolean;

    constructor(name: string)
    {
        this._name          = name;
        this._isRunning     = false;
    }

    public async run(): Promise<void>
    {
        if(!this._isRunning)
        {
            this._isRunning = true;

            await this.onRun();

            this._isRunning = false;
        }
    }

    protected abstract async onRun(): Promise<void>;

    public get name(): string
    {
        return this._name;
    }

    public get isRunning(): boolean
    {
        return this._isRunning;
    }
}