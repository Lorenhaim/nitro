import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitRemoveComposer extends Outgoing
{
    private _unitId: number;

    constructor(unitId: number)
    {
        super(OutgoingHeader.UNIT_REMOVE);

        if(unitId > 0)
        {
            this._unitId = unitId;
        }
        else
        {
            throw new Error('invalid_unitId');
        }
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeString(this._unitId.toString()).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}