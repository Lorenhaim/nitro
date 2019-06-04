import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitTypingComposer extends Outgoing
{
    private _unitId: number;
    private _flag: boolean;

    constructor(unitId: number, flag: boolean)
    {
        super(OutgoingHeader.UNIT_TYPING);

        if(!unitId) throw new Error('invalid_unit');
        
        this._unitId    = unitId;
        this._flag      = flag || false;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._unitId, this._flag ? 1 : 0).prepare();
    }
}