import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { UserEntity } from './UserEntity';

@Entity('rooms')
export class RoomEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id', nullable: true })
    public userId: number;

    @Column({ name: 'name' })
    public username: string;

    @Column({ name: 'description' })
    public password: string;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}