import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { CurrencyType } from '../../game';
import { UserEntity } from './UserEntity';

@Entity('user_currency')
@Unique(['userId', 'type'])
export class UserCurrencyEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'type', type: 'enum', enum: CurrencyType })
    public type: CurrencyType;

    @Column({ name: 'amount' })
    public amount: number;

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}