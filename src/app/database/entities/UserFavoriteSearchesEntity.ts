import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './UserEntity';

@Entity('user_favorite_searches')
export class UserFavoriteSearchesEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'search_query' })
    public searchQuery: string;

    @Column({ name: 'search_mode', type: 'enum', enum: ['0', '1'], default: '0' })
    public searchMode: '0' | '1';

    @Column({ name: 'search_collapsed', type: 'enum', enum: ['0', '1'], default: '0' })
    public searchCollapsed: '0' | '1';

    @ManyToOne(type => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}