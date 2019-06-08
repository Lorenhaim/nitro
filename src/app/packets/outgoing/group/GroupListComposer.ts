import { Group } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupListComposer extends Outgoing
{
    private _groups: Group[];

    constructor(...groups: Group[])
    {
        super(OutgoingHeader.GROUP_LIST);

        this._groups = [ ...groups ];
    }

    public compose(): OutgoingPacket
    {
        const totalGroups = this._groups.length;

        if(!totalGroups) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalGroups);

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            this.packet
                .writeInt(group.id)
                .writeString(group.name)
                .writeString(group.badge)
                .writeString(group.colorOne.toString())
                .writeString(group.colorTwo.toString())
                .writeBoolean(group.id === this.client.user.details.favoriteGroupId)
                .writeInt(group.userId)
                .writeBoolean(group.forumEnabled);
        }

        return this.packet.prepare();
    }
}