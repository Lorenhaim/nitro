import { TimeHelper } from '../../common';
import { RoomEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { RoomBanType, RoomChatMode, RoomChatProtection, RoomChatSpeed, RoomChatWeight, RoomKickType, RoomState, RoomThickness, RoomTradeType } from './interfaces';
import { Room } from './Room';

export class RoomDetails
{
    private _room: Room;
    private _entity: RoomEntity;

    constructor(room: Room, entity: RoomEntity)
    {
        if(!(room instanceof Room) || !(entity instanceof RoomEntity)) throw new Error('invalid_room');

        this._room      = room;
        this._entity    = entity;
    }

    public save(): void
    {
        Emulator.gameScheduler.saveRoom(this._entity);
    }

    public setUsersNow(count: number): void
    {
        this._entity.usersNow = count;

        this._entity.lastActive = TimeHelper.now;

        this.save();
    }

    public setFloorPaint(color: number)
    {
        this._entity.paintFloor = color;

        this.save();
    }

    public setWallPaint(color: number)
    {
        this._entity.paintWall = color;

        this.save();
    }

    public setLandscapePaint(color: string)
    {
        this._entity.paintLandscape = color;

        this.save();
    }

    public get room(): Room
    {
        return this._room;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get ownerId(): number
    {
        return this._entity.ownerId;
    }

    public get ownerName(): string
    {
        return this._entity.ownerName;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get description(): string
    {
        return this._entity.description;
    }

    public get state(): RoomState
    {
        return parseInt(<any> this._entity.state);
    }

    public get password(): string
    {
        return this._entity.password;
    }

    public get modelId(): number
    {
        return this._entity.modelId;
    }

    public get categoryId(): number
    {
        return this._entity.categoryId;
    }

    public get usersNow(): number
    {
        return this._entity.usersNow;
    }

    public get usersMax(): number
    {
        return this._entity.usersMax;
    }

    public get tradeType(): RoomTradeType
    {
        return parseInt(<any> this._entity.tradeType);
    }

    public get paintWall(): number
    {
        return this._entity.paintWall;
    }

    public get paintFloor(): number
    {
        return this._entity.paintFloor;
    }

    public get paintLandscape(): string
    {
        return this._entity.paintLandscape;
    }

    public get wallHeight(): number
    {
        return this._entity.wallHeight;
    }

    public get hideWalls(): boolean
    {
        return this._entity.hideWalls === '1';
    }

    public get thicknessWall(): RoomThickness
    {
        return parseInt(<any> this._entity.thicknessWall);
    }

    public get thicknessFloor(): RoomThickness
    {
        return parseInt(<any> this._entity.thicknessFloor);
    }

    public get allowPets(): boolean
    {
        return this._entity.allowPets === '1';
    }

    public get allowPetsEat(): boolean
    {
        return this._entity.allowPetsEat === '1';
    }

    public get allowMute(): number
    {
        return this._entity.allowMute
    }

    public get allowKick(): RoomKickType
    {
        return this._entity.allowKick;
    }

    public get allowBan(): RoomBanType
    {
        return this._entity.allowBan;
    }

    public get allowWalkthrough(): boolean
    {
        return this._entity.allowWalkthrough === '1';
    }

    public get chatMode(): RoomChatMode
    {
        return this._entity.chatMode;
    }

    public get chatWeight(): RoomChatWeight
    {
        return this._entity.chatWeight;
    }

    public get chatSpeed(): RoomChatSpeed
    {
        return this._entity.chatSpeed;
    }

    public get chatDistance(): number
    {
        return this._entity.chatDistance;
    }

    public get chatProtection(): RoomChatProtection
    {
        return this._entity.chatProtection;
    }

    public get lastActive(): Date
    {
        return this._entity.lastActive;
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }
}