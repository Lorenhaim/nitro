import { getManager } from 'typeorm';
import { Manager } from '../common';
import { ItemEntity, PetEntity, RoomEntity, UserEntity } from '../database';

export class GameScheduler extends Manager
{
    private _itemEntities: ItemEntity[];
    private _itemInterval: NodeJS.Timeout;

    private _roomEntities: RoomEntity[];
    private _roomInterval: NodeJS.Timeout;

    private _userEntities: UserEntity[];
    private _userInterval: NodeJS.Timeout;

    private _petEntities: PetEntity[];
    private _petInterval: NodeJS.Timeout;

    constructor()
    {
        super('GameScheduler');

        this._itemEntities  = [];
        this._itemInterval  = null;

        this._roomEntities  = [];
        this._roomInterval  = null;

        this._userEntities  = [];
        this._userInterval  = null;

        this._petEntities   = [];
        this._petInterval   = null;
    }

    protected onInit(): void
    {
        this._itemInterval = setInterval(async () => await this.saveItemEntities(), 10000);

        this._roomInterval = setInterval(async () => await this.saveRoomEntities(), 10000);

        this._userInterval = setInterval(async () => await this.saveUserEntities(), 10000);

        this._petInterval = setInterval(async () => await this.savePetEntities(), 10000);
    }

    protected onDispose(): void
    {
        if(this._itemInterval) clearInterval(this._itemInterval);

        if(this._roomInterval) clearInterval(this._roomInterval);

        if(this._userInterval) clearInterval(this._userInterval);

        if(this._petInterval) clearInterval(this._petInterval);
    }

    public saveItem(entity: ItemEntity): void
    {
        if(!entity) return;

        const totalItems = this._itemEntities.length;

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const pendingEntity = this._itemEntities[i];

                if(!pendingEntity) continue;

                if(pendingEntity === entity) return;
            }
        }

        this._itemEntities.push(entity);
    }

    public saveRoom(entity: RoomEntity): void
    {
        if(!entity) return;

        const totalRooms = this._roomEntities.length;

        if(totalRooms)
        {
            for(let i = 0; i < totalRooms; i++)
            {
                const pendingEntity = this._roomEntities[i];

                if(!pendingEntity) continue;

                if(pendingEntity === entity) return;
            }
        }

        this._roomEntities.push(entity);
    }

    public saveUser(entity: UserEntity): void
    {
        if(!entity) return;

        const totalUsers = this._userEntities.length;

        if(totalUsers)
        {
            for(let i = 0; i < totalUsers; i++)
            {
                const pendingEntity = this._userEntities[i];

                if(!pendingEntity) continue;

                if(pendingEntity === entity) return;
            }
        }

        this._userEntities.push(entity);
    }

    public savePet(entity: PetEntity): void
    {
        if(!entity) return;

        const totalPets = this._petEntities.length;

        if(totalPets)
        {
            for(let i = 0; i < totalPets; i++)
            {
                const pendingEntity = this._petEntities[i];

                if(!pendingEntity) continue;

                if(pendingEntity === entity) return;
            }
        }

        this._petEntities.push(entity);
    }

    private async saveItemEntities(): Promise<void>
    {
        try
        {
            const entities: ItemEntity[] = [];

            const totalEntities = this._itemEntities.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._itemEntities.shift());

            const totalSaveEntities = entities.length;

            if(!totalSaveEntities) return;

            for(let i = 0; i < totalSaveEntities; i++)
            {
                const entity = entities[i];

                if(!entity) continue;

                if(!entity.userId)
                {
                    await getManager().delete(ItemEntity, entity.id);

                    entities.splice(i, 1);
                }
            }

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveRoomEntities(): Promise<void>
    {
        try
        {
            const entities: RoomEntity[] = [];

            const totalEntities = this._roomEntities.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._roomEntities.shift());

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async saveUserEntities(): Promise<void>
    {
        try
        {
            const entities: UserEntity[] = [];

            const totalEntities = this._userEntities.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._userEntities.shift());

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }

    private async savePetEntities(): Promise<void>
    {
        try
        {
            const entities: PetEntity[] = [];

            const totalEntities = this._petEntities.length;

            if(!totalEntities) return;

            for(let i = 0; i < totalEntities; i++) entities.push(this._petEntities.shift());

            if(entities.length) await getManager().save(entities);
        }

        catch(err)
        {
            this.logger.error(err.message || err, err.stack);
        }
    }
}