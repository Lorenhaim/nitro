import { Unit } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitIdleComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.UNIT_IDLE);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                    .writeInt(this._unit.id)
                    .writeBoolean(this._unit.isIdle)
                    .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}