export abstract class PluginEvent
{
    protected _isCancelled: boolean;

    constructor()
    {
        this._isCancelled = false;
    }

    public cancel(): void
    {
        this._isCancelled = true;
    }

    public get isCancelled(): boolean
    {
        return this._isCancelled;
    }
}