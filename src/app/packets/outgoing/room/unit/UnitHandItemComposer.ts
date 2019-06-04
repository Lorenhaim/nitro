import { Unit } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitHandItemComposer extends Outgoing
{
    private _unit: Unit;

    constructor(unit: Unit)
    {
        super(OutgoingHeader.UNIT_HAND_ITEM);

        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._unit.id, this._unit.location.handType || 0).prepare();
    }
}