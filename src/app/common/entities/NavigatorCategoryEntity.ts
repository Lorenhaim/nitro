import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('navigator_categories')
export class NavigatorCategoryEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name', unique: true })
    public name: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}