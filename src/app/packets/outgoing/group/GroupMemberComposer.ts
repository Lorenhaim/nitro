import { TimeHelper } from '../../../common';
import { GroupMember } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupMemberComposer extends Outgoing
{
    private _member: GroupMember;

    constructor(member: GroupMember)
    {
        super(OutgoingHeader.GROUP_MEMBER);

        if(!(member instanceof GroupMember)) throw new Error('invalid_member');

        this._member = member;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._member.groupId)
            .writeInt(this._member.rank)
            .writeInt(this._member.userId)
            .writeString(this._member.user.details.username)
            .writeString(this._member.user.details.figure)
            .writeString(TimeHelper.formatDate(this._member.timestampCreated, 'MMM DD, YYYY'))
            .prepare();
    }
}