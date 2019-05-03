import { Manager } from '../../common';
import { BotDao } from '../../database';
import { Bot } from '../bot';
import { Position } from '../pathfinder';
import { User } from '../user';
import { Room } from './Room';

export class RoomBotManager extends Manager
{
    private _room: Room;

    private _bots: Bot[];

    constructor(room: Room)
    {
        super('RoomBotManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

        this._bots  = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadBots();
    }

    protected async onDispose(): Promise<void>
    {
        const totalBots = this._bots.length;

        if(!totalBots) return;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = this._bots[i];

            if(!bot) continue;

            await this._room.unitManager.removeUnit(bot.unit);

            this._bots.splice(i, 1);
        }
    }

    public getBot(id: number): Bot
    {
        if(!id) return null;
        
        const totalBots = this._bots.length;

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

    public getBotByName(name: string): Bot
    {
        if(!name) return null;
        
        const totalBots = this._bots.length;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = this._bots[i];

            if(bot.name === name) return bot;
        }

        return null;
    }

    public async placeBot(user: User, botId: number, position: Position): Promise<void>
    {
        if(!user || !botId || !position) return;

        const bot = user.inventory.bots.getBot(botId);

        if(!bot) return;

        if(this.hasBot(bot.id)) return;

        const tile = this._room.map.getValidTile(bot.unit, position);

        if(!tile) return;

        position.z = tile.walkingHeight;

        bot.setRoom(this._room);

        user.inventory.bots.removeBot(bot);

        await this._room.unitManager.addUnit(bot.unit, position);

        this._bots.push(bot);

        bot.unit.location.dance(bot.dance);

        this._room.map.updatePositions(position);

        if(bot.freeRoam)
        {
            bot.unit.location.roam();

            bot.unit.timer.startRoamTimer();
        }

        bot.save();
    }

    public async pickupBot(user: User, botId: number): Promise<void>
    {
        if(!user || !botId) return;

        const totalBots = this._bots.length;

        if(!totalBots) return;

        for(let i = 0; i < totalBots; i++)
        {
            const bot = this._bots[i];

            if(!bot) continue;

            if(bot.id !== botId) continue;

            await bot.unit.reset(false);

            this._bots.splice(i, 1);

            bot.clearRoom();

            user.inventory.bots.addBot(bot);

            bot.save();

            return;
        }
    }

    private async loadBots(): Promise<void>
    {
        this._bots = [];

        const results = await BotDao.loadRoomBots(this._room.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            const bot = new Bot(result);

            await this._room.unitManager.addUnit(bot.unit, new Position(result.x, result.y, parseFloat(result.z), result.direction, result.direction));

            this._bots.push(bot);

            bot.unit.location.dance(bot.dance);

            if(bot.freeRoam)
            {
                bot.unit.location.roam();

                bot.unit.timer.startRoamTimer();
            }
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get bots(): Bot[]
    {
        return this._bots;
    }
}