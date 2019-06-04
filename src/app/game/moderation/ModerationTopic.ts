import { ModerationTopicEntity } from '../../database';

export class ModerationTopic
{
    private _entity: ModerationTopicEntity;

    constructor(entity: ModerationTopicEntity)
    {
        if(!(entity instanceof ModerationTopicEntity)) throw new Error('invalid_topic');

        this._entity = entity;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }
}