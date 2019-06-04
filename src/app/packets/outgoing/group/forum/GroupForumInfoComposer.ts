import { Group } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class GroupForumInfoComposer extends Outgoing
{
    private _group: Group;

    constructor(group: Group)
    {
        super(OutgoingHeader.GROUP_FORUM_INFO);

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group = group;
    }

    public compose(): OutgoingPacket
    {
        this._group.forum.parseInfo(this.packet);

        return this.packet
            .writeInt(this._group.forum.forumRead)
            .writeInt(this._group.forum.forumReply)
            .writeInt(this._group.forum.forumPost)
            .writeInt(this._group.forum.forumMod)
            .writeString('') // error read
            .writeString('') // error post
            .writeString('') // error thread
            .writeString('') // error moderator
            .writeString('')
            .writeBoolean(this._group.isOwner(this.client.user))
            .writeBoolean(this._group.isAdmin(this.client.user))
            .prepare();
    }
}