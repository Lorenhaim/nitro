import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Direction } from '../../game';
import { PetBreed } from '../../game/pet/PetBreed';
import { RoomEntity } from './RoomEntity';
import { UserEntity } from './UserEntity';

@Entity('pets')
export class PetEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'room_id', nullable: true })
    public roomId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'level', default: 1 })
    public level: number;

    @Column({ name: 'breed', type: 'enum', enum: PetBreed })
    public breed: PetBreed;

    @Column({ name: 'race' })
    public race: number;

    @Column({ name: 'color' })
    public color: string;

    @Column({ name: 'hair_style' })
    public hairStyle: number;

    @Column({ name: 'hair_color' })
    public hairColor: number;

    @Column({ name: 'x', width: 2, default: '0' })
    public x: number;

    @Column({ name: 'y', width: 2, default: '0' })
    public y: number;

    @Column({ name: 'z', type: 'decimal', precision: 3, scale: 2, default: '0' })
    public z: string;

    @Column({ name: 'direction', type: 'enum', enum: Direction, default: Direction.NORTH })
    public direction: Direction;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;

    @ManyToOne(type => RoomEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'room_id' })
    public room: RoomEntity;
}