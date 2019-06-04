import { RollerData, Unit } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitRollingComposer extends Outgoing
{
    private _rollerData: RollerData;
    private _unit: Unit;

    constructor(rollerData: RollerData, unit: Unit)
    {
        super(OutgoingHeader.ROLLING);

        if(!(rollerData instanceof RollerData) || !(unit instanceof Unit)) throw new Error('invalid_roll');

        this._rollerData    = rollerData;
        this._unit          = unit;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._rollerData.position.x)
            .writeInt(this._rollerData.position.y)
            .writeInt(this._rollerData.positionNext.x)
            .writeInt(this._rollerData.positionNext.y)
            .writeInt(0)
            .writeInt(this._rollerData.roller.id)
            .writeInt(2)
            .writeInt(this._unit.id)
            .writeString((this._unit.location.rolling.height + this._unit.location.additionalHeight).toFixed(2))
            .writeString((this._unit.location.rolling.nextHeight  + this._unit.location.additionalHeight).toFixed(2))
            .prepare();
    }
}