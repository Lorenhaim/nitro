import { TimeHelper } from '../../../common';
import { GroupMemberEntity } from '../../../database/entities/GroupMemberEntity';
import { Group } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupMembersComposer extends Outgoing
{
    private _group: Group;
    private _pageId: number;
    private _search: string;
    private _listType: number;
    private _members: GroupMemberEntity[];
    private _totalResults: number;

    constructor(group: Group, pageId: number, search: string, listType: number, members: { members: GroupMemberEntity[], totalResults: number })
    {
        super(OutgoingHeader.GROUP_MEMBERS);

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group     = group;
        this._pageId    = pageId;
        this._search    = search;
        this._listType  = listType;

        this._members       = members.members;
        this._totalResults  = members.totalResults || 0;
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeInt(this._group.id)
            .writeString(this._group.name)
            .writeInt(this._group.roomId)
            .writeString(this._group.badge)
            .writeInt(this._totalResults);

        if(this._members)
        {
            const totalMembers = this._members.length;

            if(totalMembers)
            {
                this.packet.writeInt(totalMembers);

                for(let i = 0; i < totalMembers; i++)
                {
                    const member = this._members[i];

                    this.packet
                        .writeInt(parseInt(<any> member.rank))
                        .writeInt(member.userId)
                        .writeString(member.user.username)
                        .writeString(member.user.figure)
                        .writeString(TimeHelper.formatDate(member.timestampCreated, 'MMM DD, YYYY'))
                }
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);
        
        return this.packet
            .writeBoolean(this._group.isAdmin(this.client.user))
            .writeInt(14)
            .writeInt(this._pageId)
            .writeInt(this._listType)
            .writeString(this._search)
            .prepare();
    }
}