import { BotDao } from '../../../../database';
import { UserBotAddComposer, UserBotRemoveComposer } from '../../../../packets';
import { Bot } from '../../../bot';
import { User } from '../../User';

export class UserBots
{
    private _user: User;

    private _bots: Bot[];

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user              = user;
        
        this._bots              = [];

        this._isLoaded          = false;
        this._isLoading         = false;

        this._isDisposed        = false;
        this._isDisposing       = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading = true;

            await this.loadBots();

            this._isLoaded      = true;
            this._isLoading     = false;
            this._isDisposed    = false;
        }
    }

    public async reload(): Promise<void>
    {
        await this.dispose();
        await this.init();
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing   = true;

            this._bots          = [];

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
    }

    public getBot(id: number): Bot
    {
        const totalBots = this._bots.length;

        if(!totalBots) return null;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = this._bots[i];

            if(bot.id === id) return bot;
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

            for(let j = 0; j < totalActiveBots; j++)
            {
                const activeBot = this._bots[j];

                if(!activeBot) continue;

                if(activeBot !== bot) continue;

                this._user.connections.processOutgoing(new UserBotRemoveComposer(activeBot.id));

                this._bots.splice(j, 1);
            }
        }
    }

    private async loadBots(): Promise<void>
    {
        this._bots = [];

        const results = await BotDao.loadUserBots(this._user.id);

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._bots.push(new Bot(results[i]));
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get bots(): Bot[]
    {
        return this._bots;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}