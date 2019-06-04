import { Manager } from '../../../common';
import { GroupDao } from '../../../database';
import { OutgoingPacket } from '../../../packets';
import { Group } from '../Group';
import { ForumSetting } from './ForumSetting';
import { ForumThread } from './ForumThread';

export class Forum extends Manager
{
    private _group: Group;

    constructor(group: Group)
    {
        super('GroupForum');

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group = group;
    }

    protected async onInit(): Promise<void>
    {
        //
    }

    protected async onDispose(): Promise<void>
    {
        //
    }

    public async getThreads(offset: number): Promise<[ForumThread[], number]>
    {
        const results = await GroupDao.getThreadsByGroupId(this._group.id, offset);

        const resultThreads = results[0];
        const totalThreads  = results[1];

        if(!resultThreads) return [ null, 0 ];

        const totalResults = resultThreads.length;

        if(!totalResults) return [ null, 0 ];

        const threads: ForumThread[] = [];

        for(let i = 0; i < totalResults; i++)
        {
            const result = resultThreads[i];

            if(!result) continue;

            threads.push(new ForumThread(result, this));
        }

        if(!threads.length) return [ null, 0 ];

        return [ threads, totalResults ];
    }

    public parseInfo(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return null;

        return packet
            .writeInt(this._group.id)
            .writeString(this._group.name, this._group.description, this._group.badge)
            .writeInt(0) // total threads
            .writeInt(0) // Rating
            .writeInt(0) // total comments
            .writeInt(0) // total unread
            .writeInt(-1) // last comment id
            .writeInt(-1) // last comment user id
            .writeString('') // last comment username
            .writeInt(0); // time between now and last comment created
    }

    public get group(): Group
    {
        return this._group;
    }

    public get forumRead(): ForumSetting
    {
        return parseInt(<any> this._group.entity.forumRead);
    }

    public get forumReply(): ForumSetting
    {
        return parseInt(<any> this._group.entity.forumReply);
    }

    public get forumPost(): ForumSetting
    {
        return parseInt(<any> this._group.entity.forumPost);
    }

    public get forumMod(): ForumSetting
    {
        return parseInt(<any> this._group.entity.forumMod);
    }
}