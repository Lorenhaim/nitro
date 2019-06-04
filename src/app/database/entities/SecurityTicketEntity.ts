import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TicketType } from '../../game';
import { UserEntity } from './UserEntity';

@Entity('security_tickets')
export class SecurityTicketEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'ticket' })
    public ticket: string;

    @Column({ name: 'ticket_type', type: 'enum', enum: TicketType })
    public ticketType: TicketType;

    @Column({ name: 'ip_address' })
    public ipAddress: string;

    @Column({ name: 'is_locked', type: 'enum', enum: ['0', '1'], default: '0' })
    public isLocked: '0' | '1';

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;

    @Column({ name: 'timestamp_expires', default: () => 'CURRENT_TIMESTAMP' })
    public timestampExpires: Date;

    @ManyToOne(type => UserEntity, user => user.securityTickets, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}