import { getManager } from 'typeorm';
import { Manager } from '../../common';
import { RoomDao, RoomEntity, RoomModelEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { User } from '../user';
import { RoomCreate } from './interfaces';
import { RoomModel } from './models';
import { Room } from './Room';

export class RoomManager extends Manager
{
    private _rooms: Room[];
    private _roomModels: RoomModel[];

    constructor()
    {
        super('RoomManager');

        this._rooms             = [];
        this._roomModels        = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadRoomModels();
    }

    protected async onDispose(): Promise<void>
    {
        const totalRooms = this._rooms.length;

        if(!totalRooms) return;
        
        for(let i = 0; i < totalRooms; i++)
        {
            const room = this._rooms[i];

            if(!room) continue;

            await room.dispose();

            this._rooms.splice(i, 1);
        }
    }

    public async getRoom(roomId: number): Promise<Room>
    {
        if(!roomId) return null;

        let room = this.getActiveRoom(roomId);

        if(room) return room;

        return await this.getOfflineRoom(roomId);
    }

    public getActiveRoom(roomId: number): Room
    {
        if(!roomId) return null;

        const totalRooms = this._rooms.length;

        if(!totalRooms) return null;

        for(let i = 0; i < totalRooms; i++)
        {
            const room = this._rooms[i];

            if(!room) continue;

            if(room.id !== roomId) continue;

            room.cancelDispose();

            return room;
        }

        return null;
    }

    public async getOfflineRoom(roomId: number): Promise<Room>
    {
        if(!roomId) return null;

        const entity = await RoomDao.loadRoom(roomId);

        if(!entity) return null;

        const room = new Room(entity);

        if(!room) return null;

        return this.addRoom(room);
    }

    private addRoom(room: Room): Room
    {
        if(!(room instanceof Room)) return null;

        let instance = this.getActiveRoom(room.id);

        if(instance) return instance;

        this._rooms.push(room);

        return room;
    }

    public hasRoom(roomId: number): boolean
    {
        return this.getActiveRoom(roomId) !== null;
    }

    public async removeRoom(room: Room): Promise<void>
    {
        if(!room) return;
        
        const totalRooms = this._rooms.length;

        if(!totalRooms) return;
        
        for(let i = 0; i < totalRooms; i++)
        {
            const activeRoom = this._rooms[i];

            if(!activeRoom) continue;

            if(activeRoom !== room) continue;

            await activeRoom.dispose();

            this._rooms.splice(i, 1);

            return;
        }
    }

    public async deleteRoom(room: Room, user: User): Promise<void>
    {
        if(!room) return;

        room = await this.getRoom(room.id);

        if(!room) return;
        
        if(!room.securityManager.isOwner(user)) return;

        room.botManager.pickupAllBots(user);

        room.petManager.pickupAllPets(user);

        room.itemManager.removeAllItems(user);

        await this.removeRoom(room);
        
        await getManager().delete(RoomEntity, room.id);
    }

    public async createRoom(user: User, data: RoomCreate): Promise<number>
    {
        if(!user || !data) return null;

        const model = this.getModelByName(data.modelName);

        if(!model) return null;
        
        const category = Emulator.gameManager.navigatorManager.getCategory(data.categoryId);

        if(!category) return null;
        
        const newRoom = new RoomEntity();

        newRoom.name        = data.name;
        newRoom.description = data.description;
        newRoom.ownerId     = user.details.id;
        newRoom.ownerName   = user.details.username;
        newRoom.modelId     = model.id;
        newRoom.categoryId  = data.categoryId;
        newRoom.usersMax    = data.usersMax;
        newRoom.tradeType   = data.tradeType;

        await getManager().save(newRoom);

        return newRoom.id;
    }

    public getModel(modelId: number): RoomModel
    {
        if(!modelId) return null;
        
        const totalModels = this._roomModels.length;

        if(!totalModels) return null;
        
        for(let i = 0; i < totalModels; i++)
        {
            const model = this._roomModels[i];

            if(!model) continue;

            if(model.id === modelId) return model;
        }

        return null;
    }

    public getModelByName(name: string): RoomModel
    {
        if(!name) return null;
        
        const totalModels = this._roomModels.length;

        if(!totalModels) return null;
        
        for(let i = 0; i < totalModels; i++)
        {
            const model = this._roomModels[i];

            if(model.name === name) return model;
        }

        return null;
    }

    public hasModel(modelId: number): boolean
    {
        return this.getModel(modelId) !== null;
    }

    private async loadRoomModels(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._roomModels = [];

        const results = await getManager().find(RoomModelEntity, {
            where: {
                enabled: '1',
                custom: '0'
            }
        });

        if(!results) return;
        
        const totalResults = results.length;

        if(totalResults) for(let i = 0; i < totalResults; i++) this._roomModels.push(new RoomModel(results[i]));

        this.logger.log(`Loaded ${ this._roomModels.length } models`);
    }

    public async loadCustomModel(modelId: number): Promise<void>
    {
        if(!modelId) return;

        const model = this.getModel(modelId);

        if(model) return;

        const result = await getManager().findOne(RoomModelEntity, {
            where: {
                id: modelId,
                enabled: '1',
                custom: '1'
            }
        });

        if(!result) return;
        
        this._roomModels.push(new RoomModel(result));
    }

    public get rooms(): Room[]
    {
        return this._rooms;
    }

    public get models(): RoomModel[]
    {
        return this._roomModels;
    }
}