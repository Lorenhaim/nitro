import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class GroupMembersRefreshComposer extends Outgoing
{
    private _groupId: number;

    constructor(groupId: number)
    {
        super(OutgoingHeader.GROUP_MEMBERS_REFRESH);

        if(!groupId) throw new Error('invalid_group');

        this._groupId = groupId;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._groupId, 0).prepare();
    }
}