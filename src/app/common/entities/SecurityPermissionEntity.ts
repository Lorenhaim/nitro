import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';

import { SecurityRankEntity } from './SecurityRankEntity';

@Entity('security_permissions')
export class SecurityPermissionEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'permission_name' })
    public permissionName: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @OneToMany(type => SecurityRankEntity, rank => rank.permission)
    public ranks: SecurityRankEntity[];
}