export abstract class Plugin
{
    private _name: string;

    constructor(name: string)
    {
        this._name = name;
    }

    public get name(): string
    {
        return this._name;
    }
}