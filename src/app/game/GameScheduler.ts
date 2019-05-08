import { getManager } from 'typeorm';
import { Manager } from '../common';
import { BotEntity, ItemEntity, PetEntity, RoomEntity, UserEntity } from '../database';
import { Bot } from './bot';
import { Item } from './item';
import { Pet } from './pet';
import { Room } from './room';
import { User } from './user';

export class GameScheduler extends Manager
{
    private _items: Item[];
    private _itemInterval: NodeJS.Timeout;

    private _rooms: Room[];
    private _roomInterval: NodeJS.Timeout;

    private _users: User[];
    private _userInterval: NodeJS.Timeout;

    private _pets: Pet[];
    private _petInterval: NodeJS.Timeout;

    private _bots: Bot[];
    private _botInterval: NodeJS.Timeout;

    constructor()
    {
        super('GameScheduler');

        this._items  = [];
        this._itemInterval  = null;

        this._rooms  = [];
        this._roomInterval  = null;

        this._users  = [];
        this._userInterval  = null;

        this._pets   = [];
        this._petInterval   = null;

        this._bots   = [];
        this._botInterval   = null;
    }

    protected onInit(): void
    {
        this._itemInterval = setInterval(async () => await this.saveItems(), 10000);

        this._roomInterval = setInterval(async () => await this.saveRooms(), 10000);

        this._userInterval = setInterval(async () => await this.saveUsers(), 10000);

        this._petInterval = setInterval(async () => await this.savePets(), 10000);

        this._botInterval = setInterval(async () => await this.saveBots(), 10000);
    }

    protected onDispose(): void
    {
        if(this._itemInterval) clearInterval(this._itemInterval);

        if(this._roomInterval) clearInterval(this._roomInterval);

        if(this._userInterval) clearInterval(this._userInterval);

        if(this._petInterval) clearInterval(this._petInterval);

        if(this._botInterval) clearInterval(this._botInterval);
    }

    public saveItem(item: Item): void
    {
        if(!item) return;

        const totalItems = this._items.length;

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const pendingItem = this._items[i];

                if(!pendingItem) continue;

                if(pendingItem === item) return;
            }
        }

        this._items.push(item);
    }

    public saveRoom(room: Room): void
    {
        if(!room) return;

        const totalRooms = this._rooms.length;

        if(totalRooms)
        {
            for(let i = 0; i < totalRooms; i++)
            {
                const pendingRoom = this._rooms[i];

                if(!pendingRoom) continue;

                if(pendingRoom === room) return;
            }
        }

        this._rooms.push(room);
    }

    public saveUser(user: User): void
    {
        if(!user) return;

        const totalUsers = this._users.length;

        if(totalUsers)
        {
            for(let i = 0; i < totalUsers; i++)
            {
                const pendingUser = this._users[i];

                if(!pendingUser) continue;

                if(pendingUser === user) return;
            }
        }

        this._users.push(user);
    }

    public savePet(pet: Pet): void
    {
        if(!pet) return;

        const totalPets = this._pets.length;

        if(totalPets)
        {
            for(let i = 0; i < totalPets; i++)
            {
                const pendingPet = this._pets[i];

                if(!pendingPet) continue;

                if(pendingPet === pet) return;
            }
        }

        this._pets.push(pet);
    }

    public saveBot(bot: Bot): void
    {
        if(!bot) return;

        const totalBots = this._bots.length;

        if(totalBots)
        {
            for(let i = 0; i < totalBots; i++)
            {
                const pendingBot = this._bots[i];

                if(!pendingBot) continue;

                if(pendingBot === bot) return;
            }
        }

        this._bots.push(bot);
    }

    private async saveItems(): Promise<void>
    {
        try
        {
            const entities: ItemEntity[] = [];

            const totalItems = this._items.length;

            if(!totalItems) return;

            for(let i = 0; i < totalItems; i++)
            {
                const item = this._items.shift();

                if(!item) continue;

                if(item.willRemove)
                {
                    await getManager().delete(ItemEntity, item.id);

                    continue;
                }

                entities.push(item.entity);
            }

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveRooms(): Promise<void>
    {
        try
        {
            const entities: RoomEntity[] = [];

            const totalEntities = this._rooms.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._rooms.shift().details.entity);

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveUsers(): Promise<void>
    {
        try
        {
            const entities: UserEntity[] = [];

            const totalEntities = this._users.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._users.shift().details.entity);

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async savePets(): Promise<void>
    {
        try
        {
            const entities: PetEntity[] = [];

            const totalPets = this._pets.length;

            if(!totalPets) return;

            for(let i = 0; i < totalPets; i++) entities.push(this._pets.shift().entity);

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveBots(): Promise<void>
    {
        try
        {
            const entities: BotEntity[] = [];

            const totalBots = this._bots.length;

            if(!totalBots) return;

            for(let i = 0; i < totalBots; i++) entities.push(this._bots.shift().entity);

            if(entities.length) await getManager().save(entities)
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }
}