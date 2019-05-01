import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CatalogItemEntity } from './CatalogItemEntity';
import { ItemBaseEntity } from './ItemBaseEntity';
import { ItemEntity } from './ItemEntity';
import { UserEntity } from './UserEntity';

@Entity('catalog_items_limited')
@Unique(['baseId', 'limitedNumber'])
export class CatalogItemLimitedEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id', nullable: true })
    public userId: number;

    @Column({ name: 'base_id' })
    public baseId: number;

    @Column({ name: 'catalog_item_id', nullable: true })
    public catalogItemId: number;

    @Column({ name: 'item_id', nullable: true })
    public itemId: number;

    @Column({ name: 'limited_number' })
    public limitedNumber: number;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => ItemBaseEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'base_id' })
    public base: ItemBaseEntity;

    @ManyToOne(type => CatalogItemEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'catalog_item_id' })
    public catalogItem: ItemBaseEntity;

    @ManyToOne(type => ItemEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'item_id' })
    public item: ItemEntity;
}