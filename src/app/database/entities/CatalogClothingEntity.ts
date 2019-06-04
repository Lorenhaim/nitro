import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('catalog_clothing')
export class CatalogClothingEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'figure_ids' })
    public figureIds: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}