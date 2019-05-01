export class Storage<T, K>
{
    private _sets: K[];
    private _total: number;

    constructor()
    {
        this._sets  = [];
        this._total = 0;
    }

    public get(key: T): K
    {
        return this._sets[key.toString()] || null;
    }

    public set(key: T, value: K): void
    {
        if(!this._sets[key.toString()])
        {
            this._sets[key.toString()] = value;
            this._total++;
        }
        else
        {
            this.remove(key);
            this.set(key, value);
        }
    }

    public remove(key: T): void
    {
        if(this._sets[key.toString()])
        {
            delete this._sets[key.toString()];
            this._total--;
        }
    }

    public reset(): void
    {
        this._sets = [];
    }

    public get total(): number
    {
        return this._total;
    }
}