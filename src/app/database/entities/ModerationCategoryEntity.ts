import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('moderation_category')
export class ModerationCategoryEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'topic_ids' })
    public topicIds: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}