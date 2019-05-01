export abstract class Interaction
{
    private _name: string;

    constructor(name: string)
    {
        if(name === null) throw new Error('invalid_interactor');

        this._name = name;
    }

    public get name(): string
    {
        return this._name;
    }
}