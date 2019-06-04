import { Equal, getManager } from 'typeorm';
import { GroupRank } from '../../game';
import { GroupEntity, GroupForumPostEntity, GroupForumThreadEntity } from '../entities';
import { GroupMemberEntity } from '../entities/GroupMemberEntity';

export class GroupDao
{
    public static async getGroupById(id: number): Promise<GroupEntity>
    {
        if(!id) return null;

        const result = await getManager()
            .createQueryBuilder(GroupEntity, 'group')
            .select(['group', 'room.id', 'room.name', 'user.id', 'user.username' ])
            .where('group.id = :id', { id })
            .leftJoin('group.room', 'room')
            .innerJoin('group.user', 'user')
            .loadRelationCountAndMap('group.totalMembers', 'group.members', 'member', qb => qb.andWhere('member.rank IN (:rank)', { rank: [ GroupRank.OWNER.toString(), GroupRank.ADMIN.toString(), GroupRank.MEMBER.toString() ] }))
            .loadRelationCountAndMap('group.totalMembersPending', 'group.members', 'memberPending', qb => qb.andWhere('memberPending.rank = :rank', { rank: GroupRank.REQUESTED.toString() }))
            .getOne();

        if(!result) return null;
        
        return result;
    }

    public static async getTotalPendingByGroupId(id: number): Promise<number>
    {
        if(!id) return null;

        const result = await getManager().count(GroupMemberEntity, {
            where: {
                groupId: id,
                rank: Equal(GroupRank.REQUESTED.toString())
            }
        });

        if(!result) return 0;

        return result;
    }

    public static async getMembersByGroupId(id: number, pageId: number, search: string, adminOnly: boolean = false, requestsOnly: boolean = false): Promise<[GroupMemberEntity[], number]>
    {
        if(!id || pageId === null) return null;

        let query = getManager()
            .createQueryBuilder(GroupMemberEntity, 'member')
            .select(['member', 'user.id', 'user.username', 'user.figure' ])
            .where('member.groupId = :id', { id });

        if(search)
        {
            query = query.andWhere('user.username LIKE :search', { search: search + '%' });
        }

        if(adminOnly)
        {
            query = query
                .andWhere('member.rank = :rank', { rank: GroupRank.OWNER.toString() })
                .orWhere('member.rank = :rank', { rank: GroupRank.ADMIN.toString() });
        }

        else if(requestsOnly)
        {
            query = query.andWhere('member.rank = :rank', { rank: GroupRank.REQUESTED.toString() });
        }

        else
        {
            query = query.andWhere('member.rank != :rank', { rank: GroupRank.REQUESTED.toString() })
        }

        const results = await query
            .innerJoin('member.user', 'user')
            .take(14)
            .skip(pageId * 14)
            .getManyAndCount();

        if(!results.length) return null;

        return results;
    }

    public static async getMembershipsByUserId(userId: number): Promise<GroupMemberEntity[]>
    {
        if(!userId) return null;

        const results = await getManager().find(GroupMemberEntity, {
            where: { userId }
        });

        if(!results.length) return null;
        
        return results;
    }

    public static async getMembershipByGroupId(groupId: number, userId: number): Promise<GroupMemberEntity>
    {
        if(!groupId || !userId) return null;

        const result = await getManager().findOne(GroupMemberEntity, {
            where: { groupId, userId }
        });

        if(!result) return null;

        return result;
    }

    public static async addMembership(groupId: number, userId: number, rank: GroupRank): Promise<GroupMemberEntity>
    {
        if(!groupId || !userId) return null;

        const entity = new GroupMemberEntity();

        entity.groupId  = groupId;
        entity.userId   = userId;
        entity.rank     = <any> rank.toString();

        await getManager().save(entity);

        return entity;
    }

    public static async updateMembership(groupId: number, userId: number, rank: GroupRank): Promise<void>
    {
        if(!groupId || !userId) return null;

        await getManager().update(GroupMemberEntity, {
            groupId,
            userId
        }, { rank });
    }

    public static async removeMembership(groupId: number, userId: number): Promise<void>
    {
        if(!groupId || !userId) return;

        await getManager().delete(GroupMemberEntity, {
            groupId,
            userId
        });
    }

    public static async getThreadsByGroupId(id: number, offset: number): Promise<[GroupForumThreadEntity[], number]>
    {
        if(!id || offset === null) return null;

        const results = await getManager()
            .createQueryBuilder(GroupForumThreadEntity, 'thread')
            .select(['thread', 'user.id', 'user.username', 'user.figure', 'user.motto' ])
            .where('thread.groupId = :id', { id })
            .innerJoin('thread.user', 'user')
            .innerJoinAndMapOne('thread.lastPost', GroupForumPostEntity, 'post', null)
            .innerJoin('post.user', 'thread.lastPost.user')
            .take(20)
            .skip(offset)
            .getManyAndCount();

        if(!results.length) return null;

        return results;
    }
}