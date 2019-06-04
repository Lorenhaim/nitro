import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Direction, UnitDance, UnitGender } from '../../game';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';

@Entity('bots')
export class BotEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'room_id', nullable: true })
    public roomId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'motto', nullable: true })
    public motto: string;

    @Column({ name: 'gender', type: 'enum', enum: UnitGender, default: UnitGender.MALE })
    public gender: UnitGender;

    @Column({ name: 'figure', default: 'hr-115-42.hd-195-19.ch-3030-82.lg-275-1408.fa-1201.ca-1804-64' })
    public figure: string;

    @Column({ name: 'x', width: 2, default: '0' })
    public x: number;

    @Column({ name: 'y', width: 2, default: '0' })
    public y: number;

    @Column({ name: 'z', type: 'decimal', precision: 3, scale: 2, default: '0' })
    public z: string;

    @Column({ name: 'direction', type: 'enum', enum: Direction, default: Direction.NORTH })
    public direction: Direction;

    @Column({ name: 'dance', type: 'enum', enum: UnitDance, default: '0' })
    public dance: UnitDance;

    @Column({ name: 'free_roam', type: 'enum', enum: ['0', '1'], default: '0' })
    public freeRoam: '0' | '1';

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => RoomEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'room_id' })
    public room: RoomEntity;
}