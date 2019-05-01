import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('word_filter')
export class WordFilterEntity
{
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'word', unique: true })
    public word: string;

    @Column({ name: 'replacement' })
    public replacement: string;

    @Column({ name: 'timestamp_created', default: () => 'CURRENT_TIMESTAMP' })
    public timestampCreated: Date;
}