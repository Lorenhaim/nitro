import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEntity } from './GroupEntity';
import { UserEntity } from './UserEntity';

@Entity('user_info')
export class UserInfoEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'home_room', default: '0' })
    public homeRoom: number;

    @Column({ name: 'favorite_group_id', nullable: true })
    public favoriteGroupId: number;

    @Column({ name: 'club_expiration', nullable: true })
    public clubExpiration: Date;

    @Column({ name: 'respects_received', default: '0' })
    public respectsReceived: number;

    @Column({ name: 'respects_remaining', default: '0' })
    public respectsRemaining: number;

    @Column({ name: 'respects_pet_remaining', default: '0' })
    public respectsPetRemaining: number;

    @Column({ name: 'achievement_score', default: '0' })
    public achievementScore: number;

    @Column({ name: 'friendrequests_disabled', type: 'enum', enum: ['0', '1'], default: '0' })
    public friendRequestsDisabled: '0' | '1';

    @Column({ name: 'navigator_x', default: '100' })
    public navigatorX: number;

    @Column({ name: 'navigator_y', default: '100' })
    public navigatorY: number;

    @Column({ name: 'navigator_width', default: '435' })
    public navigatorWidth: number;

    @Column({ name: 'navigator_height', default: '535' })
    public navigatorHeight: number;

    @Column({ name: 'navigator_search_open', type: 'enum', enum: ['0', '1'], default: '0' })
    public navigatorSearchOpen: '0' | '1';

    @Column({ name: 'toolbar_show_friends', type: 'enum', enum: ['0', '1'], default: '1' })
    public toolbarShowFriends: '0' | '1';

    @OneToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => GroupEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'favorite_group_id' })
    public favoriteGroup: GroupEntity;
}