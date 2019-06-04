import { TimeHelper } from '../../../common';
import { GroupForumPostEntity, GroupForumThreadEntity } from '../../../database';
import { OutgoingPacket } from '../../../packets';
import { User } from '../../user';
import { Forum } from './Forum';
import { ForumThreadState } from './ForumThreadState';

export class ForumThread
{
    private _entity: GroupForumThreadEntity;

    private _forum: Forum;

    constructor(entity: GroupForumThreadEntity, forum: Forum)
    {
        if(!(entity instanceof GroupForumThreadEntity)) throw new Error('invalid_entity');

        if(!(forum instanceof Forum)) throw new Error('invalid_forum');

        this._entity    = entity;

        this._forum     = forum;
    }

    public parseInfo(packet: OutgoingPacket, user: User): OutgoingPacket
    {
        if(!packet || !user) return null;

        return packet
            .writeInt(this.id)
            .writeInt(this.userId)
            .writeString(this.userName)
            .writeString(this.subject)
            .writeBoolean(false) // pinned
            .writeBoolean(false) // locked
            .writeInt(TimeHelper.between(this.timestampCreated, TimeHelper.now, 's'))
            .writeInt(0) // posts
            .writeInt(0) // unread posts
            .writeInt(1)
            .writeInt(this.lastPost.userId || -1) // last author id
            .writeString(this.lastPost && this.lastPost.user && this.lastPost.user.username || '') // last author username
            .writeInt(this.lastPost && TimeHelper.to(this.lastPost.timestampCreated, 's') || 0) // last comment time
            .writeBytes(ForumThreadState.OPEN)
            .writeInt(0) // admin id
            .writeString('') // admin username
            .writeInt(this.id); // thread id
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get forum(): Forum
    {
        return this._forum;
    }

    public get groupId(): number
    {
        return this._entity.groupId;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get userName(): string
    {
        return this._entity.user.username;
    }

    public get subject(): string
    {
        return this._entity.subject;
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }

    public get lastPost(): GroupForumPostEntity
    {
        return this._entity.lastPost || null;
    }
}