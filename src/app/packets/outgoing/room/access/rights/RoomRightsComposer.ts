import { RoomRightsType } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class RoomRightsComposer extends Outgoing
{
    private _rightsType: RoomRightsType;

    constructor(rightsType: RoomRightsType)
    {
        super(OutgoingHeader.ROOM_RIGHTS);

        this._rightsType = rightsType || RoomRightsType.NONE;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._rightsType).prepare();
    }
}