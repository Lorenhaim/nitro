import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitRemoveComposer extends Outgoing
{
    private _unitId: number;

    constructor(unitId: number)
    {
        super(OutgoingHeader.UNIT_REMOVE);

        if(!unitId) throw new Error('invalid_unit');

        this._unitId = unitId;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeString(this._unitId.toString()).prepare();
    }
}