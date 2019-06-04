import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyType } from '../../game';
import { CatalogItemLimitedEntity } from './CatalogItemLimitedEntity';
import { CatalogPageEntity } from './CatalogPageEntity';
import { ItemBaseEntity } from './ItemBaseEntity';

@Entity('catalog_items')
export class CatalogItemEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'page_id', nullable: true })
    public pageId: number;

    @Column({ name: 'base_id' })
    public baseId: number;

    @Column({ name: 'product_name' })
    public productName: string;

    @Column({ name: 'offer_id', default: 0 })
    public offerId: number;

    @Column({ name: 'cost_credits', default: 0 })
    public costCredits: number;

    @Column({ name: 'cost_currency', default: 0 })
    public costCurrency: number;

    @Column({ name: 'cost_currency_type', type: 'enum', enum: CurrencyType })
    public costCurrencyType: CurrencyType;

    @Column({ name: 'amount', default: 1 })
    public amount: number;

    @Column({ name: 'limited_sells', default: 0 })
    public limitedSells: number;

    @Column({ name: 'limited_stack', default: 0 })
    public limitedStack: number;

    @Column({ name: 'has_offer', type: 'enum', enum: ['0', '1'], default: '1' })
    public hasOffer: '0' | '1';

    @Column({ name: 'club_only', type: 'enum', enum: ['0', '1'], default: '0' })
    public clubOnly: '0' | '1';

    @Column({ name: 'extra_data', nullable: true })
    public extraData: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => CatalogPageEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'page_id' })
    public page: CatalogPageEntity;

    @ManyToOne(type => ItemBaseEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'base_id' })
    public base: ItemBaseEntity;

    @OneToMany(type => CatalogItemLimitedEntity, item => item.catalogItem)
    public sellsLimited: CatalogItemLimitedEntity[];
}