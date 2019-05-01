import { Unit, UnitRolling } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitRollingComposer extends Outgoing
{
    private _unit: Unit;
    private _rollingData: UnitRolling;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.ROLLING);

        if(!(unit instanceof Unit) || !unit.location.rolling) throw new Error('invalid_roll');

        this._unit          = unit;
        this._rollingData   = unit.location.rolling.copy();

        //unit.location.rolling = null;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet
                .writeInt(this._rollingData.position.x)
                .writeInt(this._rollingData.position.y)
                .writeInt(this._rollingData.positionNext.x)
                .writeInt(this._rollingData.positionNext.y)
                .writeInt(0)
                .writeInt(this._rollingData.roller.id)
                .writeInt(2)
                .writeInt(this._unit.id)
                .writeString(this._rollingData.position.z.toFixed(2))
                .writeString(this._rollingData.positionNext.z.toFixed(2))
                .prepare();

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}