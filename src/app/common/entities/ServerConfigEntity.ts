import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('server_config')
export class ServerConfigEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'key', unique: true })
    public key: string;

    @Column({ name: 'value' })
    public value: string;
}