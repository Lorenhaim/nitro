import { RollerData } from '../item';
import { Unit } from './Unit';

export class UnitRolling
{
    private _unit: Unit;
    private _rollerData: RollerData;

    private _height: number;
    private _nextHeight: number;

    constructor(unit: Unit, rollerData: RollerData, height: number, nextHeight: number)
    {
        if(!(unit instanceof Unit) || !(rollerData instanceof RollerData)) throw new Error('invalid_roll');

        this._unit          = unit;
        this._rollerData    = rollerData;

        this._height        = height;
        this._nextHeight    = nextHeight;
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public get rollerData(): RollerData
    {
        return this._rollerData;
    }

    public get height(): number
    {
        return this._height;
    }

    public get nextHeight(): number
    {
        return this._nextHeight;
    }
}