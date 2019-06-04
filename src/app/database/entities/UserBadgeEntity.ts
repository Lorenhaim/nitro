import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BadgeSlot } from '../../game';
import { UserEntity } from './UserEntity';

@Entity('user_badges')
@Unique(['userId', 'badgeCode'])
export class UserBadgeEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'badge_code' })
    public badgeCode: string;

    @Column({ name: 'slot_number', type: 'enum', enum: BadgeSlot, default: BadgeSlot.NONE })
    public slotNumber: BadgeSlot;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}