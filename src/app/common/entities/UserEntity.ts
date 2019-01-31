import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { RoomEntity } from './RoomEntity';
import { SecurityRankEntity } from './SecurityRankEntity';
import { SecurityTicketEntity } from './SecurityTicketEntity';
import { UserBadgeEntity } from './UserBadgeEntity';
import { UserEffectEntity } from './UserEffectEntity';
import { UserInfoEntity } from './UserInfoEntity';
import { UserStatisticsEntity } from './UserStatisticsEntity';

@Entity('users')
export class UserEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'username', unique: true })
    public username: string;

    @Column({ name: 'password', select: false })
    public password: string;

    @Column({ name: 'motto', nullable: true })
    public motto: string;

    @Column({ name: 'gender', type: 'enum', enum: ['M', 'F'], default: 'M' })
    public gender: 'M' | 'F';

    @Column({ name: 'figure', default: 'hr-115-42.hd-195-19.ch-3030-82.lg-275-1408.fa-1201.ca-1804-64' })
    public figure: string;

    @Column({ name: 'rank_id', nullable: true })
    public rankId: number;

    @Column({ name: 'online', type: 'enum', enum: ['0', '1'], default: '0' })
    public online: '0' | '1';

    @Column({ name: 'last_online', nullable: true })
    public lastOnline: Date;

    @Column({ name: 'ip_register' })
    public ipRegister: string;

    @Column({ name: 'ip_last', nullable: true })
    public ipLast: string;

    @Column({ name: 'machine_id', nullable: true })
    public machineId: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => UserBadgeEntity, badge => badge.user)
    public badges: UserBadgeEntity[];

    @OneToMany(type => UserEffectEntity, effect => effect.user)
    public effects: UserEffectEntity[];

    @ManyToOne(type => SecurityRankEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'rank_id' })
    public rank: SecurityRankEntity;

    @OneToOne(type => UserInfoEntity, info => info.user)
    public info: UserInfoEntity;

    @OneToOne(type => UserStatisticsEntity, statistics => statistics.user)
    public statistics: UserStatisticsEntity;

    @OneToMany(type => SecurityTicketEntity, ticket => ticket.user)
    public securityTickets: SecurityTicketEntity[];

    @OneToMany(type => RoomEntity, room => room.user)
    public rooms: RoomEntity[];
}