import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('messenger_friend_request')
@Unique(['userId', 'requestedId'])
export class MessengerFriendRequestEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'requested_id' })
    public requestedId: number;

    @Column({ name: 'timestamp_created', default: () => "CURRENT_TIMESTAMP" })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'requested_id' })
    public requested: UserEntity;
}