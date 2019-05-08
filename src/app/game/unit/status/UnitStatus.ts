import { UnitStatusType } from './UnitStatusType';

export class UnitStatus
{
    private _key: UnitStatusType;
    private _value: string;
    private _swap: UnitStatusType;

    private _actionCountdown: number;
    private _actionSwapCountdown: number;
    private _lifetimeCountdown: number;

    constructor(key: UnitStatusType, value?: string, swap?: UnitStatusType, actionCountdown?: number, actionSwapCountdown?: number, lifetimeCountdown?: number)
    {
        this._key                   = key || null;
        this._value                 = value || null;
        this._swap                  = swap || null;

        this._actionCountdown       = actionCountdown || -1;
        this._actionSwapCountdown   = actionSwapCountdown || -1;
        this._lifetimeCountdown     = lifetimeCountdown || -1;
    }

    public setValue(value: string)
    {
        this._value = value;
    }

    public swapKeys(): void
    {
        [ this._key, this._swap ] = [ this._swap, this._key ];
    }

    public get key(): UnitStatusType
    {
        return this._key;
    }

    public get value(): string
    {
        return this._value;
    }

    public get swap(): UnitStatusType
    {
        return this._swap;
    }

    public get actionCountdown(): number
    {
        return this._actionCountdown;
    }

    public set actionCountdown(count: number)
    {
        this._actionCountdown = count;
    }

    public get actionSwapCountdown(): number
    {
        return this._actionSwapCountdown
    }

    public set actionSwapCountdown(count: number)
    {
        this._actionSwapCountdown = count;
    }

    public get lifetimeCountdown(): number
    {
        return this._lifetimeCountdown;
    }

    public set lifetimeCountdown(count: number)
    {
        this._lifetimeCountdown = count;
    }
}