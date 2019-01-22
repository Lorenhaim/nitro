import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('user_info')
export class UserInfoEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'home_room', default: '0' })
    public homeRoom: number;

    @Column({ name: 'club_expiration', nullable: true })
    public clubExpiration: Date;

    @Column({ name: 'respects_received', default: '0' })
    public respectsReceived: number;

    @Column({ name: 'respects_remaining', default: '0' })
    public respectsRemaining: number;

    @Column({ name: 'respects_pet_remaining', default: '0' })
    public respectsPetRemaining: number;

    @Column({ name: 'achievement_score', default: '0' })
    public achievementScore: number;

    @Column({ name: 'messenger_disabled', type: 'enum', enum: ['0', '1'], default: '0' })
    public messengerDisabled: '0' | '1';

    @Column({ name: 'friendrequests_disabled', type: 'enum', enum: ['0', '1'], default: '0' })
    public friendRequestsDisabled: '0' | '1';

    @OneToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}