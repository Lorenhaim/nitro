import { Unit } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitRollingComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.ROLLING);

        if(!(unit instanceof Unit) || !unit.location.rolling) throw new Error('invalid_roll');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._unit.location.rolling.position.x)
                .writeInt(this._unit.location.rolling.position.y)
                .writeInt(this._unit.location.rolling.positionNext.x)
                .writeInt(this._unit.location.rolling.positionNext.y)
                .writeInt(0)
                .writeInt(this._unit.location.rolling.roller.id)
                .writeInt(2)
                .writeInt(this._unit.id)
                .writeString(this._unit.location.rolling.position.z.toFixed(2))
                .writeString(this._unit.location.rolling.positionNext.z.toFixed(2))
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}