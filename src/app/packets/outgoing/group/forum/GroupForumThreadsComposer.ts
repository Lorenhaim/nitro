import { ForumThread, Group } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class GroupForumThreadsComposer extends Outgoing
{
    private _group: Group;
    private _offset: number;
    private _threads: ForumThread[];

    constructor(group: Group, offset: number, ...threads: ForumThread[])
    {
        super(OutgoingHeader.GROUP_FORUM_THREADS);

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group     = group;
        this._offset    = offset;
        this._threads   = [ ...threads ];
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeInt(this._group.id)
            .writeInt(this._offset);

        const totalThreads = this._threads.length;

        if(totalThreads)
        {
            this.packet.writeInt(totalThreads);

            for(let i = 0; i < totalThreads; i++)
            {
                const thread = this._threads[i];

                thread.parseInfo(this.packet, this.client.user)
            }
        }
        else this.packet.writeInt(0);

        return this.packet.prepare();
    }
}