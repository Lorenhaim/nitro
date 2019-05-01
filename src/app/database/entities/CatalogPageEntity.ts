import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogLayouts } from '../../game';
import { CatalogItemEntity } from './CatalogItemEntity';

@Entity('catalog_pages')
export class CatalogPageEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'parent_id', nullable: true })
    public parentId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'caption', nullable: true })
    public caption: string;

    @Column({ name: 'icon_image', default: '0' })
    public iconImage: number;

    @Column({ name: 'layout', type: 'enum', enum: ['default_3x3', 'frontpage4', 'frontpage_featured', 'spaces_new'], default: 'default_3x3' })
    public layout: CatalogLayouts;

    @Column({ name: 'image_header', nullable: true })
    public imageHeader: string;

    @Column({ name: 'image_teaser', nullable: true })
    public imageTeaser: string;

    @Column({ name: 'image_special', nullable: true })
    public imageSpecial: string;

    @Column({ name: 'text_header', nullable: true })
    public textHeader: string;

    @Column({ name: 'text_details', nullable: true })
    public textDetails: string;

    @Column({ name: 'text_teaser', nullable: true })
    public textTeaser: string;

    @Column({ name: 'is_visible', type: 'enum', enum: ['0', '1'], default: '1' })
    public isVisible: '0' | '1';

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => CatalogPageEntity, page => page.children, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    public parent: CatalogPageEntity;
    
    @OneToMany(type => CatalogPageEntity, page => page.parent)
    public children: CatalogPageEntity[];

    @OneToMany(type => CatalogItemEntity, item => item.page)
    public items: CatalogItemEntity[];
}