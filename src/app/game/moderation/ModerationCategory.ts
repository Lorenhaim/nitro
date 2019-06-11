import { ModerationCategoryEntity } from '../../database';
import { Nitro } from '../../Nitro';
import { ModerationTopic } from './ModerationTopic';

export class ModerationCategory
{
    private _entity: ModerationCategoryEntity;

    private _topics: ModerationTopic[];

    constructor(entity: ModerationCategoryEntity)
    {
        if(!(entity instanceof ModerationCategoryEntity)) throw new Error('invalid_category');

        this._entity    = entity;

        this._topics    = [];

        this.loadTopics();
    }

    private loadTopics(): void
    {
        this._topics = [];
        
        const topics = this._entity.topicIds;

        if(!topics) return;

        const parts = topics.split(',');

        if(!parts) return;

        const totalParts = parts.length;

        if(!totalParts) return;

        for(let i = 0; i < totalParts; i++)
        {
            const part = parseInt(parts[i]);

            if(!part) continue;

            const topic = Nitro.gameManager.moderationManager.getTopic(part);

            if(!topic) continue;

            this._topics.push(topic);
        }
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get topics(): ModerationTopic[]
    {
        return this._topics;
    }
}