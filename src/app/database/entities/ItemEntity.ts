import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Direction } from '../../game';
import { CatalogItemLimitedEntity } from './CatalogItemLimitedEntity';
import { ItemBaseEntity } from './ItemBaseEntity';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';

@Entity('items')
export class ItemEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'base_id' })
    public baseId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'room_id', nullable: true })
    public roomId: number;

    @Column({ name: 'x', width: 2, default: '0' })
    public x: number;

    @Column({ name: 'y', width: 2, default: '0' })
    public y: number;

    @Column({ name: 'z', type: 'decimal', precision: 10, scale: 6, default: '0' })
    public z: string;

    @Column({ name: 'direction', type: 'enum', enum: ['0', '2', '4', '6'], default: '0' })
    public direction: Direction;

    @Column({ name: 'wall_position', nullable: true })
    public wallPosition: string;

    @Column({ name: 'limited_data', default: '0:0' })
    public limitedData: string;

    @Column({ name: 'wired_data', nullable: true })
    public wiredData: string;

    @Column({ name: 'extra_data', nullable: true })
    public extraData: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => ItemBaseEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'base_id' })
    public base: ItemBaseEntity;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => RoomEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'room_id' })
    public room: RoomEntity;

    @OneToOne(type => CatalogItemLimitedEntity, item => item.itemId)
    public limitedSell: CatalogItemLimitedEntity;
}