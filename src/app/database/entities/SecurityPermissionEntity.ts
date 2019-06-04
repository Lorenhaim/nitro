import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SecurityRankEntity } from './SecurityRankEntity';

@Entity('security_permissions')
export class SecurityPermissionEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'permission_name' })
    public permissionName: string;

    @Column({ name: 'all_permissions', type: 'enum', enum: ['0', '1'], default: '0' })
    public allPermissions: '0' | '1';

    @Column({ name: 'mod_tool', type: 'enum', enum: ['0', '1'], default: '0' })
    public modTool: '0' | '1';

    @Column({ name: 'any_room_owner', type: 'enum', enum: ['0', '1'], default: '0' })
    public anyRoomOwner: '0' | '1';

    @Column({ name: 'any_room_rights', type: 'enum', enum: ['0', '1'], default: '0' })
    public anyRoomRights: '0' | '1';

    @Column({ name: 'any_group_owner', type: 'enum', enum: ['0', '1'], default: '0' })
    public anyGroupOwner: '0' | '1';

    @Column({ name: 'any_group_admin', type: 'enum', enum: ['0', '1'], default: '0' })
    public anyGroupAdmin: '0' | '1';

    @Column({ name: 'enter_full_rooms', type: 'enum', enum: ['0', '1'], default: '0' })
    public enterFullRooms: '0' | '1';

    @Column({ name: 'enter_invisible_rooms', type: 'enum', enum: ['0', '1'], default: '0' })
    public enterInvisibleRooms: '0' | '1';

    @Column({ name: 'ignore_room_state', type: 'enum', enum: ['0', '1'], default: '0' })
    public ignoreRoomState: '0' | '1';

    @Column({ name: 'catalog_view_hidden', type: 'enum', enum: ['0', '1'], default: '0' })
    public catalogViewHidden: '0' | '1';

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => SecurityRankEntity, rank => rank.permission)
    public ranks: SecurityRankEntity[];
}