import { getManager } from 'typeorm';
import { GroupMemberEntity } from '../../database';
import { User } from '../user';
import { GroupRank } from './GroupRank';

export class GroupMember
{
    private _entity: GroupMemberEntity;

    private _user: User;

    constructor(entity: GroupMemberEntity, user: User)
    {
        if(!(entity instanceof GroupMemberEntity)) throw new Error('invalid_entity');

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._entity    = entity;

        this._user      = user;
    }

    public async saveNow(): Promise<void>
    {
        await getManager().save(this._entity);
    }

    public async updateRank(rank: GroupRank): Promise<void>
    {
        if(this._entity.rank === rank) return;

        this._entity.rank = rank;

        await this.saveNow();
    }

    public get user(): User
    {
        return this._user;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get groupId(): number
    {
        return this._entity.groupId;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get rank(): GroupRank
    {
        return parseInt(<any> this._entity.rank);
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }
}