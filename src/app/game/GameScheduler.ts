import { getManager } from 'typeorm';
import { Manager } from '../common';
import { BotEntity, GroupEntity, ItemEntity, PetEntity, RoomEntity, UserEntity } from '../database';
import { Bot } from './bot';
import { Group } from './group/Group';
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

    private _groups: Group[];
    private _groupInterval: NodeJS.Timeout;

    constructor()
    {
        super('GameScheduler');

        this._items         = [];
        this._itemInterval  = null;

        this._rooms         = [];
        this._roomInterval  = null;

        this._users         = [];
        this._userInterval  = null;

        this._pets          = [];
        this._petInterval   = null;

        this._bots          = [];
        this._botInterval   = null;

        this._groups          = [];
        this._groupInterval   = null;
    }

    protected async onInit(): Promise<void>
    {
        this._itemInterval  = setInterval(() => this.saveItems(), 10000);

        this._roomInterval  = setInterval(() => this.saveRooms(), 10000);

        this._userInterval  = setInterval(() => this.saveUsers(), 10000);

        this._petInterval   = setInterval(() => this.savePets(), 10000);

        this._botInterval   = setInterval(() => this.saveBots(), 10000);

        this._groupInterval = setInterval(() => this.saveGroups(), 10000);
    }

    protected async onDispose(): Promise<void>
    {
        if(this._itemInterval) clearInterval(this._itemInterval);

        if(this._roomInterval) clearInterval(this._roomInterval);

        if(this._userInterval) clearInterval(this._userInterval);

        if(this._petInterval) clearInterval(this._petInterval);

        if(this._botInterval) clearInterval(this._botInterval);

        if(this._groupInterval) clearInterval(this._groupInterval);

        await this.saveItems();
        await this.saveRooms();
        await this.saveUsers();
        await this.savePets();
        await this.saveBots();
        await this.saveGroups();
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

                if(pendingItem !== item) continue;

                return;
            }
        }

        this._items.push(item);
    }

    public removeItem(item: Item): void
    {
        if(!item) return;

        const totalItems = this._items.length;

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const pendingItem = this._items[i];

                if(!pendingItem) continue;

                if(pendingItem !== item) continue;

                this._items.splice(i, 1);

                return;
            }
        }
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

                if(pendingRoom !== room) continue;
                
                return;
            }
        }

        this._rooms.push(room);
    }

    public removeRoom(room: Room): void
    {
        if(!room) return;

        const totalRooms = this._rooms.length;

        if(totalRooms)
        {
            for(let i = 0; i < totalRooms; i++)
            {
                const pendingRoom = this._rooms[i];

                if(!pendingRoom) continue;

                if(pendingRoom !== room) continue;

                this._rooms.splice(i, 1);

                return;
            }
        }
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

                if(pendingUser !== user) continue;

                return;
            }
        }

        this._users.push(user);
    }

    public removeUser(user: User): void
    {
        if(!user) return;

        const totalUsers = this._users.length;

        if(totalUsers)
        {
            for(let i = 0; i < totalUsers; i++)
            {
                const pendingUser = this._users[i];

                if(!pendingUser) continue;

                if(pendingUser !== user) continue;

                this._users.splice(i, 1);

                return;
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

                if(pendingPet !== pet) continue;
                
                return;
            }
        }

        this._pets.push(pet);
    }

    public removePet(pet: Pet): void
    {
        if(!pet) return;

        const totalPets = this._pets.length;

        if(totalPets)
        {
            for(let i = 0; i < totalPets; i++)
            {
                const pendingPet = this._pets[i];

                if(!pendingPet) continue;

                if(pendingPet !== pet) continue;

                this._pets.splice(i, 1);

                return;
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

                if(pendingBot !== bot) continue;
                
                return;
            }
        }

        this._bots.push(bot);
    }

    public removeBot(bot: Bot): void
    {
        if(!bot) return;

        const totalBots = this._bots.length;

        if(totalBots)
        {
            for(let i = 0; i < totalBots; i++)
            {
                const pendingBot = this._bots[i];

                if(!pendingBot) continue;

                if(pendingBot !== bot) continue;

                this._bots.splice(i, 1);
                
                return;
            }
        }

        this._bots.push(bot);
    }

    public saveGroup(group: Group): void
    {
        if(!group) return;

        const totalGroups = this._groups.length;

        if(totalGroups)
        {
            for(let i = 0; i < totalGroups; i++)
            {
                const pendingGroup = this._groups[i];

                if(!pendingGroup) continue;

                if(pendingGroup !== group) continue;
                
                return;
            }
        }

        this._groups.push(group);
    }

    public removeGroup(group: Group): void
    {
        if(!group) return;

        const totalGroups = this._groups.length;

        if(totalGroups)
        {
            for(let i = 0; i < totalGroups; i++)
            {
                const pendingGroup = this._groups[i];

                if(!pendingGroup) continue;

                if(pendingGroup !== group) continue;

                this._groups.splice(i, 1);
                
                return;
            }
        }

        this._groups.push(group);
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

                if(!item || !item.entity) continue;

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

            const totalRooms = this._rooms.length;

            if(!totalRooms) return;

            for(let i = 0; i < totalRooms; i++)
            {
                const room = this._rooms.shift();

                if(!room || !room.details || !room.details.entity) continue;

                entities.push(room.details.entity);
            }

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

            for(let i = 0; i < totalEntities; i++)
            {
                const user = this._users.shift();

                if(!user || !user.details || !user.details.entity) continue;

                entities.push(user.details.entity);
            }

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

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveGroups(): Promise<void>
    {
        try
        {
            const entities: GroupEntity[] = [];

            const totalGroups = this._groups.length;

            if(!totalGroups) return;

            for(let i = 0; i < totalGroups; i++) entities.push(this._groups.shift().entity);

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }
}