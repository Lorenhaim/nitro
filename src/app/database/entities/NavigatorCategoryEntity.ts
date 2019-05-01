import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { NavigatorListCollapsed, NavigatorListMode } from '../../game/navigator/list';
import { RoomEntity } from './RoomEntity';

@Entity('navigator_categories')
export class NavigatorCategoryEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name', unique: true })
    public name: string;

    @Column({ name: 'is_public', type: 'enum', enum: ['0', '1'], default: 0 })
    public isPublic: '0' | '1';

    @Column({ name: 'show_hidden', type: 'enum', enum: ['0', '1'], default: 0 })
    public showHidden: '0' | '1';

    @Column({ name: 'list_mode', type: 'enum', enum: ['0', '1', '2'], default: '0' })
    public listMode: NavigatorListMode;

    @Column({ name: 'list_collapsed', type: 'enum', enum: ['0', '1'], default: '0' })
    public listCollapsed: NavigatorListCollapsed;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => RoomEntity, room => room.category)
    public rooms: RoomEntity[];
}