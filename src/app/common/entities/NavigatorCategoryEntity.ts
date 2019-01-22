import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('navigator_category')
export class NavigatorCategoryEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}