import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseItemType } from '../../game/item';
import { InteractionType } from '../../game/item/interaction';
import { CatalogItemEntity } from './CatalogItemEntity';
import { CatalogItemLimitedEntity } from './CatalogItemLimitedEntity';
import { ItemEntity } from './ItemEntity';

@Entity('items_base')
export class ItemBaseEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'public_name' })
    public publicName: string;

    @Column({ name: 'product_name' })
    public productName: string;

    @Column({ name: 'sprite_id' })
    public spriteId: number;

    @Column({ name: 'type', type: 'enum', enum: BaseItemType, default: BaseItemType.FLOOR })
    public type: BaseItemType;

    @Column({ name: 'width', width: 2, default: '1' })
    public width: number;

    @Column({ name: 'length', width: 2, default: '1' })
    public length: number;

    @Column({ name: 'stack_height', type: 'decimal', precision: 10, scale: 6, default: '0' })
    public stackHeight: string;

    @Column({ name: 'multi_heights', nullable: true })
    public multiHeights: string;

    @Column({ name: 'allowed_directions', nullable: true })
    public allowedDirections: string;

    @Column({ name: 'interaction', type: 'enum', enum: InteractionType, default: InteractionType.DEFAULT })
    public interaction: InteractionType;

    @Column({ name: 'total_states' })
    public totalStates: number;

    @Column({ name: 'can_stack', type: 'enum', enum: ['0', '1'], default: '0' })
    public canStack: '0' | '1';

    @Column({ name: 'can_walk', type: 'enum', enum: ['0', '1'], default: '0' })
    public canWalk: '0' | '1';

    @Column({ name: 'can_sit', type: 'enum', enum: ['0', '1'], default: '0' })
    public canSit: '0' | '1';

    @Column({ name: 'can_lay', type: 'enum', enum: ['0', '1'], default: '0' })
    public canLay: '0' | '1';

    @Column({ name: 'can_recycle', type: 'enum', enum: ['0', '1'], default: '0' })
    public canRecycle: '0' | '1';

    @Column({ name: 'can_trade', type: 'enum', enum: ['0', '1'], default: '1' })
    public canTrade: '0' | '1';

    @Column({ name: 'can_inventory_stack', type: 'enum', enum: ['0', '1'], default: '1' })
    public canInventoryStack: '0' | '1';

    @Column({ name: 'can_sell', type: 'enum', enum: ['0', '1'], default: '1' })
    public canSell: '0' | '1';

    @Column({ name: 'vending_ids', nullable: true })
    public vendingIds: string;

    @Column({ name: 'effect_ids', nullable: true })
    public effectIds: string;

    @Column({ name: 'extra_data', nullable: true })
    public extraData: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => ItemEntity, item => item.base)
    public items: ItemEntity[];

    @OneToMany(type => CatalogItemEntity, item => item.base)
    public catalogItems: CatalogItemEntity[];

    @OneToMany(type => CatalogItemLimitedEntity, item => item.base)
    public limitedSells: CatalogItemLimitedEntity[];
}