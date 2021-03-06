import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UnitGender } from '../../game';
import { UserEntity } from './UserEntity';

@Entity('user_outfits')
@Unique(['userId', 'slotNumber'])
export class UserOutfitEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'figure' })
    public figure: string;

    @Column({ name: 'gender', type: 'enum', enum: UnitGender, default: UnitGender.MALE })
    public gender: UnitGender;

    @Column({ name: 'slot_number' })
    public slotNumber: number;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}