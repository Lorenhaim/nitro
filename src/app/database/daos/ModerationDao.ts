import { getManager } from 'typeorm';
import { ModerationCategoryEntity, ModerationTopicEntity } from '../entities';

export class ModerationDao
{
    public static async loadCategories(): Promise<ModerationCategoryEntity[]>
    {
        const results = await getManager().find(ModerationCategoryEntity)

        if(results.length) return results;

        return null;
    }

    public static async loadTopics(): Promise<ModerationTopicEntity[]>
    {
        const results = await getManager().find(ModerationTopicEntity)

        if(results.length) return results;

        return null;
    }
}