import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

import { UserEntity } from './UserEntity';
import { SecurityPermissionEntity } from './SecurityPermissionEntity';

@Entity('security_rank')
export class SecurityRankEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'permission_id', nullable: true })
    public permissionId: number;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @ManyToOne(type => SecurityPermissionEntity, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'permission_id' })
    public permission: SecurityPermissionEntity;

    @OneToMany(type => UserEntity, user => user.rank)
    public users: UserEntity[];
}