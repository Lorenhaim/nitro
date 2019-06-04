import { Manager } from '../../../../common';
import { BotDao } from '../../../../database';
import { UserBotAddComposer, UserBotRemoveComposer } from '../../../../packets';
import { Bot } from '../../../bot';
import { User } from '../../User';

export class UserBots extends Manager
{
    private _user: User;
    private _bots: Bot[];

    constructor(user: User)
    {
        super('UserBots', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user  = user;
        this._bots  = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadBots();
    }

    public async onDispose(): Promise<void>
    {
        this._bots = [];
    }

    public getBot(id: number): Bot
    {
        const totalBots = this._bots.length;

        if(!totalBots) return null;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = this._bots[i];

            if(bot.id !== id) continue;
            
            return bot;
        }

        return null;
    }

    public hasBot(id: number): boolean
    {
        return this.getBot(id) !== null;
    }

    public addBot(...bots: Bot[]): void
    {
        const addedBots = [ ...bots ];

        if(!addedBots) return;
        
        const totalBots = addedBots.length;

        if(!totalBots) return;
        
        for(let i = 0; i < totalBots; i++)
        {
            const bot = addedBots[i];

            if(this.hasBot(bot.id)) continue;

            bot.clearRoom();

            this._bots.push(bot);

            this._user.connections.processOutgoing(new UserBotAddComposer(bot));
        }
    }

    public removeBot(...bots: Bot[]): void
    {
        const removedBots = [ ...bots ];

        if(!removedBots) return;
        
        const totalBots = removedBots.length;
        const totalActiveBots = this._bots.length;

        if(!totalBots || !totalActiveBots) return;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = removedBots[i];

            if(!bot) continue;

            for(let j = 0; j < totalActiveBots; j++)
            {
                const activeBot = this._bots[j];

                if(!activeBot) continue;

                if(activeBot !== bot) continue;

                this._user.connections.processOutgoing(new UserBotRemoveComposer(activeBot.id));

                this._bots.splice(j, 1);

                break;
            }
        }
    }

    private async loadBots(): Promise<void>
    {
        this._bots = [];

        const results = await BotDao.loadUserBots(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++) this._bots.push(new Bot(results[i]));
    }

    public get user(): User
    {
        return this._user;
    }

    public get bots(): Bot[]
    {
        return this._bots;
    }
}