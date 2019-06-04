import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UnitGender } from '../../game';
import { GroupEntity } from './GroupEntity';
import { GroupMemberEntity } from './GroupMemberEntity';
import { ItemEntity } from './ItemEntity';
import { MessengerCategoryEntity } from './MessengerCategoryEntity';
import { MessengerFriendEntity } from './MessengerFriendEntity';
import { MessengerRequestEntity } from './MessengerRequestEntity';
import { PetEntity } from './PetEntity';
import { RoomBanEntity } from './RoomBanEntity';
import { RoomEntity } from './RoomEntity';
import { SecurityRankEntity } from './SecurityRankEntity';
import { SecurityTicketEntity } from './SecurityTicketEntity';
import { UserBadgeEntity } from './UserBadgeEntity';
import { UserCurrencyEntity } from './UserCurrencyEntity';
import { UserEffectEntity } from './UserEffectEntity';
import { UserFavoriteRoomEntity } from './UserFavoriteRoomEntity';
import { UserFavoriteSearchesEntity } from './UserFavoriteSearchesEntity';
import { UserInfoEntity } from './UserInfoEntity';
import { UserOutfitEntity } from './UserOutfitEntity';
import { UserStatisticsEntity } from './UserStatisticsEntity';

@Entity('users')
export class UserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'username', unique: true })
    public username: string;

    @Column({ name: 'password', select: false })
    public password: string;

    @Column({ name: 'email', select: false })
    public email: string;

    @Column({ name: 'motto', nullable: true })
    public motto: string;

    @Column({ name: 'gender', type: 'enum', enum: UnitGender, default: UnitGender.MALE })
    public gender: UnitGender;

    @Column({ name: 'figure', default: 'hr-115-42.hd-195-19.ch-3030-82.lg-275-1408.fa-1201.ca-1804-64' })
    public figure: string;

    @Column({ name: 'rank_id', nullable: true })
    public rankId: number;

    @Column({ name: 'online', type: 'enum', enum: ['0', '1'], default: '0' })
    public online: '0' | '1';

    @Column({ name: 'last_online', nullable: true })
    public lastOnline: Date;

    @Column({ name: 'ip_register', select: false })
    public ipRegister: string;

    @Column({ name: 'ip_last', select: false, nullable: true })
    public ipLast: string;

    @Column({ name: 'machine_id', select: false, nullable: true })
    public machineId: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => ItemEntity, item => item.user)
    public items: ItemEntity[];

    @OneToMany(type => PetEntity, pet => pet.user)
    public pets: PetEntity[];

    @OneToMany(type => MessengerCategoryEntity, category => category.user)
    public messengerCategories: MessengerCategoryEntity[];

    @OneToMany(type => MessengerFriendEntity, friend => friend.user)
    public messengerFriends: MessengerCategoryEntity[];

    @OneToMany(type => MessengerRequestEntity, request => request.requested)
    public messengerRequests: MessengerRequestEntity[];

    @OneToMany(type => MessengerRequestEntity, request => request.user)
    public messengerRequestsSent: MessengerRequestEntity[];

    @OneToMany(type => RoomBanEntity, ban => ban.user)
    public roomBans: RoomBanEntity[];

    @OneToMany(type => RoomEntity, room => room.user)
    public rooms: RoomEntity[];

    @ManyToOne(type => SecurityRankEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'rank_id' })
    public rank: SecurityRankEntity;

    @OneToMany(type => SecurityTicketEntity, ticket => ticket.user)
    public securityTickets: SecurityTicketEntity[];

    @OneToMany(type => UserBadgeEntity, badge => badge.user)
    public badges: UserBadgeEntity[];

    @OneToMany(type => UserCurrencyEntity, currency => currency.user)
    public currencies: UserCurrencyEntity[];

    @OneToMany(type => UserEffectEntity, effect => effect.user)
    public effects: UserEffectEntity[];

    @OneToOne(type => UserInfoEntity, info => info.user, { cascade: ['insert', 'update' ] })
    public info: UserInfoEntity;

    @OneToMany(type => UserFavoriteRoomEntity, room => room.user)
    public favoriteRooms: UserFavoriteRoomEntity[];

    @OneToMany(type => UserFavoriteSearchesEntity, search => search.user)
    public favoriteSearches: UserFavoriteSearchesEntity[];

    @OneToMany(type => UserOutfitEntity, outfit => outfit.user)
    public outfits: UserEffectEntity[];

    @OneToOne(type => UserStatisticsEntity, statistics => statistics.user, { cascade: ['insert', 'update' ] })
    public statistics: UserStatisticsEntity;

    @OneToMany(type => GroupEntity, group => group.user)
    public groups: GroupEntity[];

    @OneToMany(type => GroupMemberEntity, member => member.user)
    public groupMembers: GroupMemberEntity[];

    public totalFriends: number;
}