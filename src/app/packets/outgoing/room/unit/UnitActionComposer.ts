import { Unit, UnitAction } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitActionComposer extends Outgoing
{
    private _unit: Unit;
    private _action: UnitAction;

    constructor(unit: Unit, action: UnitAction)
    {
        super(OutgoingHeader.UNIT_ACTION);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit      = unit;
        this._action    = action || UnitAction.NONE;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._unit.id, this._action).prepare();
    }
}