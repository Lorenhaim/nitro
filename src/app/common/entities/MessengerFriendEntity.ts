import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { MessengerCategoryEntity } from './MessengerCategoryEntity';
import { UserEntity } from './UserEntity';

@Entity('messenger_friends')
@Unique(['userId', 'friendId'])
export class MessengerFriendEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'friend_id' })
    public friendId: number;

    @Column({ name: 'category_id', nullable: true })
    public categoryId: number;

    @Column({ name: 'relation', type: 'enum', enum: ['0', '1', '2', '3'], default: '0' })
    public relation: 0 | 1 | 2 | 3;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'friend_id' })
    public friend: UserEntity;

    @ManyToOne(type => MessengerCategoryEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    public category: MessengerCategoryEntity;
}