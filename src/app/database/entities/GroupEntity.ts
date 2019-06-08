import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ForumSetting, GroupState } from '../../game';
import { GroupForumThreadEntity } from './GroupForumThreadEntity';
import { GroupMemberEntity } from './GroupMemberEntity';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';

@Entity('groups')
export class GroupEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'room_id', nullable: true })
    public roomId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description', nullable: true })
    public description: string;

    @Column({ name: 'badge' })
    public badge: string;

    @Column({ name: 'color_one', default: 0 })
    public colorOne: number;

    @Column({ name: 'color_two', default: 0 })
    public colorTwo: number;

    @Column({ name: 'state', type: 'enum', enum: GroupState, default: GroupState.OPEN })
    public state: GroupState;

    @Column({ name: 'member_rights', type: 'enum', enum: ['0', '1'], default: '0' })
    public memberRights: '0' | '1';

    @Column({ name: 'forum_enabled', type: 'enum', enum: ['0', '1'], default: '1' })
    public forumEnabled: '0' | '1';

    @Column({ name: 'forum_read', type: 'enum', enum: ForumSetting, default: ForumSetting.EVERYONE })
    public forumRead: ForumSetting;

    @Column({ name: 'forum_reply', type: 'enum', enum: ForumSetting, default: ForumSetting.EVERYONE })
    public forumReply: ForumSetting;

    @Column({ name: 'forum_post', type: 'enum', enum: ForumSetting, default: ForumSetting.EVERYONE })
    public forumPost: ForumSetting;

    @Column({ name: 'forum_mod', type: 'enum', enum: ForumSetting, default: ForumSetting.EVERYONE })
    public forumMod: ForumSetting;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @OneToOne(type => RoomEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'room_id' })
    public room: RoomEntity;

    @OneToMany(type => GroupMemberEntity, member => member.group)
    public members: GroupMemberEntity[];

    @OneToMany(type => GroupForumThreadEntity, thread => thread.group)
    public threads: GroupForumThreadEntity[];

    public totalMembers: number;
    public totalMembersPending: number;
}