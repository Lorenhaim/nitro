import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Unique } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('user_badge')
@Unique(['userId', 'slotNumber'])
export class UserBadgeEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'badge_code' })
    public badgeCode: string;

    @Column({ name: 'slot_number', enum: ['1', '2', '3', '4', '5'], nullable: true })
    public slotNumber: null | '1' | '2' | '3' | '4' | '5';

    @OneToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}