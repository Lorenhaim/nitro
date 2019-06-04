import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('moderation_topic')
export class ModerationTopicEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'action' })
    public action: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}