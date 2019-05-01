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
    private _roomsDisposing: Room[];
    private _roomModels: RoomModel[];

    private _roomDisposeInterval: NodeJS.Timeout;

    constructor()
    {
        super('RoomManager');

        this._rooms             = [];
        this._roomsDisposing    = [];
        this._roomModels        = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadRoomModels();

        this._roomDisposeInterval = setInterval(async () => await this.disposeRooms(), 60000);
    }

    protected async onDispose(): Promise<void>
    {
        if(this._roomDisposeInterval) clearInterval(this._roomDisposeInterval);
        
        await this.disposeRooms();

        const totalRooms = this._rooms.length;

        if(totalRooms)
        {
            for(let i = 0; i < totalRooms; i++)
            {
                const room = this._rooms[i];

                await room.dispose();

                this._rooms.splice(i, 1);
            }
        }
    }

    private async disposeRooms(): Promise<void>
    {
        const totalRoomsDisposing = this._roomsDisposing.length;

        if(totalRoomsDisposing)
        {
            for(let i = 0; i < totalRoomsDisposing; i++)
            {
                const disposingRoom = this._roomsDisposing[i];

                if(disposingRoom)
                {
                    await disposingRoom.dispose();

                    this._roomsDisposing.splice(i, 1);
                }
            }
        }
    }

    public async getRoom(id: number): Promise<Room>
    {
        if(id)
        {
            const totalRoomsDisposing = this._roomsDisposing.length;

            if(totalRoomsDisposing)
            {
                for(let i = 0; i < totalRoomsDisposing; i++)
                {
                    const room = this._roomsDisposing[i];

                    if(room.id === id)
                    {
                        if(room.isDisposing) console.log('room already closing');

                        this._rooms.push(room);
                        this._roomsDisposing.splice(i, 1);

                        return room;
                    }
                }
            }

            const totalRooms = this._rooms.length;

            if(totalRooms)
            {
                for(let i = 0; i < totalRooms; i++)
                {
                    const room = this._rooms[i];

                    if(room.id === id) return room;
                }
            }

            const entity = await RoomDao.loadRoom(id);

            if(entity)
            {
                const room = new Room(entity);

                if(room) return room;
            }
        }

        return null;
    }

    public addRoom(room: Room): Room
    {
        if(room)
        {
            const totalRoomsDisposing = this._roomsDisposing.length;

            if(totalRoomsDisposing)
            {
                for(let i = 0; i < totalRoomsDisposing; i++)
                {
                    const disposingRoom = this._roomsDisposing[i];

                    if(disposingRoom.id === room.id)
                    {
                        if(disposingRoom.isDisposing) console.log('room already closing');

                        this._rooms.push(disposingRoom);
                        this._roomsDisposing.splice(i, 1);

                        return disposingRoom;
                    }
                }
            }

            const totalRooms = this._rooms.length;

            if(totalRooms)
            {
                for(let i = 0; i < totalRooms; i++)
                {
                    const activeRoom = this._rooms[i];

                    if(activeRoom.id === room.id) return activeRoom;
                }
            }

            this._rooms.push(room);

            return room;
        }

        return null;
    }

    public removeRoom(room: Room): void
    {
        if(room)
        {
            const totalRooms = this._rooms.length;

            if(totalRooms)
            {
                for(let i = 0; i < totalRooms; i++)
                {
                    const activeRoom = this._rooms[i];

                    if(activeRoom)
                    {
                        if(activeRoom.id === room.id)
                        {
                            this._roomsDisposing.push(activeRoom);
                            
                            this._rooms.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    public getModel(modelId: number): RoomModel
    {
        if(modelId)
        {
            const totalModels = this._roomModels.length;

            if(totalModels)
            {
                for(let i = 0; i < totalModels; i++)
                {
                    const model = this._roomModels[i];

                    if(model.id === modelId) return model;
                }
            }
        }

        return null;
    }

    public getModelByName(name: string): RoomModel
    {
        if(name)
        {
            const totalModels = this._roomModels.length;

            if(totalModels)
            {
                for(let i = 0; i < totalModels; i++)
                {
                    const model = this._roomModels[i];

                    if(model.name === name) return model;
                }
            }
        }

        return null;
    }

    private async loadRoomModels(): Promise<void>
    {
        this._roomModels = [];

        const results = await getManager().find(RoomModelEntity, {
            where: {
                enabled: '1'
            }
        });

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._roomModels.push(new RoomModel(results[i]));
        }

        this.logger.log(`Loaded ${ this._roomModels.length } models`);
    }

    public async createRoom(user: User, data: RoomCreate): Promise<number>
    {
        if(user && data)
        {
            const model = this.getModelByName(data.modelName);

            if(model)
            {
                const category = Emulator.gameManager.navigatorManager.getCategory(data.categoryId);

                if(category)
                {
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
            }
        }

        return null;
    }

    public get rooms(): Room[]
    {
        return this._rooms;
    }

    public get roomsDisposing(): Room[]
    {
        return this._roomsDisposing;
    }

    public get models(): RoomModel[]
    {
        return this._roomModels;
    }
}