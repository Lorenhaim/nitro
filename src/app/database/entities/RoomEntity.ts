import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomBanType, RoomChatMode, RoomChatProtection, RoomChatSpeed, RoomChatWeight, RoomKickType, RoomMuteType, RoomState, RoomThickness, RoomTradeType } from '../../game';
import { GroupEntity } from './GroupEntity';
import { ItemEntity } from './ItemEntity';
import { NavigatorCategoryEntity } from './NavigatorCategoryEntity';
import { PetEntity } from './PetEntity';
import { RoomBanEntity } from './RoomBanEntity';
import { RoomModelEntity } from './RoomModelEntity';
import { RoomRightsEntity } from './RoomRightsEntity';
import { UserEntity } from './UserEntity';
import { UserFavoriteRoomEntity } from './UserFavoriteRoomEntity';
import { UserLikedRoomEntity } from './UserLikedRoomEntity';

@Entity('rooms')
export class RoomEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description', nullable: true })
    public description: string;

    @Column({ name: 'owner_id' })
    public ownerId: number;

    @Column({ name: 'owner_name' })
    public ownerName: string;

    @Column({ name: 'state', type: 'enum', enum: RoomState, default: RoomState.OPEN })
    public state: RoomState;

    @Column({ name: 'password', nullable: true })
    public password: string;

    @Column({ name: 'model_id', nullable: true })
    public modelId: number;

    @Column({ name: 'category_id', nullable: true })
    public categoryId: number;

    @Column({ name: 'users_now', default: 0 })
    public usersNow: number;

    @Column({ name: 'users_max', default: 0 })
    public usersMax: number;

    @Column({ name: 'trade_type', type: 'enum', enum: RoomTradeType, default: RoomTradeType.DISABLED })
    public tradeType: RoomTradeType;

    @Column({ name: 'paint_wall', nullable: true })
    public paintWall: number;

    @Column({ name: 'paint_floor', nullable: true })
    public paintFloor: number;

    @Column({ name: 'paint_landscape', type: 'decimal', precision: 3, scale: 2, nullable: true })
    public paintLandscape: string;

    @Column({ name: 'wall_height', default: '-1' })
    public wallHeight: number;

    @Column({ name: 'hide_walls', type: 'enum', enum: ['0', '1'], default: '0' })
    public hideWalls: '0' | '1';

    @Column({ name: 'thickness_wall', type: 'enum', enum: RoomThickness, default: RoomThickness.NORMAL })
    public thicknessWall: RoomThickness;

    @Column({ name: 'thickness_floor', type: 'enum', enum: RoomThickness, default: RoomThickness.NORMAL })
    public thicknessFloor: RoomThickness;

    @Column({ name: 'allow_editing', type: 'enum', enum: ['0', '1'], default: '1' })
    public allowEditing: '0' | '1';

    @Column({ name: 'allow_pets', type: 'enum', enum: ['0', '1'], default: '0' })
    public allowPets: '0' | '1';

    @Column({ name: 'allow_pets_eat', type: 'enum', enum: ['0', '1'], default: '0' })
    public allowPetsEat: '0' | '1';

    @Column({ name: 'allow_mute', type: 'enum', enum: RoomMuteType, default: RoomMuteType.NONE })
    public allowMute: RoomMuteType;

    @Column({ name: 'allow_kick', type: 'enum', enum: RoomKickType, default: RoomKickType.NONE })
    public allowKick: RoomKickType;

    @Column({ name: 'allow_ban', type: 'enum', enum: RoomBanType, default: RoomBanType.NONE })
    public allowBan: RoomBanType;

    @Column({ name: 'allow_walkthrough', type: 'enum', enum: ['0', '1'], default: '0' })
    public allowWalkThrough: '0' | '1';

    @Column({ name: 'chat_mode', type: 'enum', enum: RoomChatMode, default: RoomChatMode.FREE_FLOW })
    public chatMode: RoomChatMode;

    @Column({ name: 'chat_weight', type: 'enum', enum: RoomChatWeight, default: RoomChatWeight.NORMAL })
    public chatWeight: RoomChatWeight;

    @Column({ name: 'chat_speed', type: 'enum', enum: RoomChatSpeed, default: RoomChatSpeed.NORMAL })
    public chatSpeed: RoomChatSpeed;

    @Column({ name: 'chat_distance', default: '50' })
    public chatDistance: number;

    @Column({ name: 'chat_protection', type: 'enum', enum: RoomChatProtection, default: RoomChatProtection.NORMAL })
    public chatProtection: RoomChatProtection;

    @Column({ name: 'last_active', default: () => 'CURRENT_TIMESTAMP' })
    public lastActive: Date;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => RoomModelEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'model_id' })
    public model: RoomModelEntity;

    @OneToMany(type => RoomBanEntity, ban => ban.room)
    public bans: RoomBanEntity[];

    @OneToMany(type => RoomRightsEntity, right => right.user)
    public rights: RoomRightsEntity[];

    @OneToMany(type => ItemEntity, item => item.room)
    public items: ItemEntity[];

    @ManyToOne(type => NavigatorCategoryEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    public category: NavigatorCategoryEntity;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'owner_id' })
    public user: UserEntity;

    @OneToOne(type => GroupEntity, group => group.room)
    public group: GroupEntity;

    @OneToMany(type => UserFavoriteRoomEntity, favorite => favorite.user)
    public userFavorites: UserFavoriteRoomEntity[];

    @OneToMany(type => UserLikedRoomEntity, liked => liked.user)
    public userLikes: UserLikedRoomEntity[];

    @OneToMany(type => PetEntity, pet => pet.room)
    public pets: PetEntity[];

    public totalLikes: number;
}