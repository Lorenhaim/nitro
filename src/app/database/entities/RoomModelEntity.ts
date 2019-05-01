import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Direction } from '../../game/pathfinder';
import { RoomEntity } from './RoomEntity';

@Entity('room_models')
export class RoomModelEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name', unique: true })
    public name: string;

    @Column({ name: 'door_x' })
    public doorX: number;

    @Column({ name: 'door_y' })
    public doorY: number;

    @Column({ name: 'door_direction' })
    public doorDirection: Direction;

    @Column({ name: 'model', type: 'text' })
    public model: string;

    @Column({ name: 'enabled', type: 'enum', enum: ['0', '1'], default: '1' })
    public enabled: '0' | '1';

    @OneToMany(type => RoomEntity, room => room.model)
    public rooms: RoomEntity[];
}