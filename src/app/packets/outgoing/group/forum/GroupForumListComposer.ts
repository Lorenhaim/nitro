import { ForumMode, Group } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class GroupForumListComposer extends Outgoing
{
    private _mode: ForumMode;
    private _offset: number;
    private _groups: Group[];

    constructor(mode: ForumMode, offset: number, ...groups: Group[])
    {
        super(OutgoingHeader.GROUP_FORUM_LIST);

        if(!groups) throw new Error('invalid_groups');

        this._mode      = mode;
        this._offset    = offset;
        this._groups    = [ ...groups ];
    }

    public compose(): OutgoingPacket
    {
        const totalGroups = this._groups.length;

        this.packet.writeInt(this._mode);
        this.packet.writeInt(totalGroups);
        this.packet.writeInt(this._offset);

        this.packet.writeInt(totalGroups);

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            group.forum.parseInfo(this.packet);
        }

        return this.packet.prepare();
    }
}