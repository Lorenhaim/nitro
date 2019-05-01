import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('server_config')
export class ServerConfigEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'key', unique: true })
    public key: string;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'is_public', type: 'enum', enum: ['0', '1'], default: '0' })
    public isPublic: '0' | '1';
}