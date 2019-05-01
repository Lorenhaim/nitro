import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SecurityRankEntity } from './SecurityRankEntity';

@Entity('security_permissions')
export class SecurityPermissionEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'permission_name' })
    public permissionName: string;

    @Column({ name: 'mod_tool', type: 'enum', enum: ['0', '1'], default: '0' })
    public modTool: '0' | '1';

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => SecurityRankEntity, rank => rank.permission)
    public ranks: SecurityRankEntity[];
}