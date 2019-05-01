import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ItemEntity } from './ItemEntity';

@Entity('item_teleports')
@Unique(['teleportIdOne', 'teleportIdTwo'])
export class ItemTeleportsEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'teleport_id_one' })
    public teleportIdOne: number;

    @Column({ name: 'teleport_id_two' })
    public teleportIdTwo: number;

    @ManyToOne(type => ItemEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'teleport_id_one' })
    public teleportOne: ItemEntity;

    @ManyToOne(type => ItemEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'teleport_id_two' })
    public teleportTwo: ItemEntity;
}