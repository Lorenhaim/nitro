import { Manager } from '../../common';
import { ModerationDao } from '../../database';
import { ModerationCategory } from './ModerationCategory';
import { ModerationTopic } from './ModerationTopic';

export class ModerationManager extends Manager
{
    private _topics: ModerationTopic[];
    private _categories: ModerationCategory[];

    constructor()
    {
        super('ModerationManager');

        this._topics        = [];
        this._categories    = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadTopics();
        await this.loadCategories();
    }

    protected async onDispose(): Promise<void>
    {
        this._topics        = [];
        this._categories    = [];
    }

    public getTopic(id: number): ModerationTopic
    {
        const totalTopics = this._topics.length;

        if(!totalTopics) return null;

        for(let i = 0; i < totalTopics; i++)
        {
            const topic = this._topics[i];

            if(!topic) continue;

            if(topic.id === id) return topic;
        }

        return null;
    }

    public getCategory(id: number): ModerationCategory
    {
        const totalCategories = this._categories.length;

        if(!totalCategories) return null;

        for(let i = 0; i < totalCategories; i++)
        {
            const category = this._categories[i];

            if(!category) continue;

            if(category.id === id) return category;
        }

        return null;
    }

    private async loadTopics(): Promise<void>
    {
        this._topics = [];

        const results = await ModerationDao.loadTopics();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._topics.push(new ModerationTopic(results[i]));
        }

        this.logger.log(`Loaded ${ this._topics.length } topics`);
    }

    private async loadCategories(): Promise<void>
    {
        this._categories = [];

        const results = await ModerationDao.loadCategories();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._categories.push(new ModerationCategory(results[i]));
        }

        this.logger.log(`Loaded ${ this._categories.length } categories`);
    }

    public get topics(): ModerationTopic[]
    {
        return this._topics;
    }

    public get categories(): ModerationCategory[]
    {
        return this._categories;
    }
}