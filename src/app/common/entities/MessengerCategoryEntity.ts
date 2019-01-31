import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('messenger_categories')
@Unique(['userId', 'categoryName'])
export class MessengerCategoryEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'category_name' })
    public categoryName: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}