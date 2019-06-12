import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('user_effects')
@Unique(['userId', 'effectId'])
export class UserEffectEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'effect_id' })
    public effectId: number;

    @Column({ name: 'seconds_allowed' })
    public secondsAllowed: number;

    @Column({ name: 'seconds_used', default: 0 })
    public secondsUsed: number;

    @Column({ name: 'timestamp_activated', nullable: true })
    public timestampActivated: Date;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}