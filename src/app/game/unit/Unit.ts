import { NumberHelper } from '../../common';
import { Emulator } from '../../Emulator';
import { HotelViewComposer, RoomEnterComposer, RoomModelNameComposer, RoomOwnerComposer, RoomRightsComposer, RoomRightsListComposer, RoomSpectatorComposer, UnitIdleComposer, UserFowardRoomComposer } from '../../packets';
import { Bot } from '../bot';
import { Pet } from '../pet';
import { Room, RoomRightsType } from '../room';
import { PermissionList } from '../security';
import { User } from '../user';
import { UnitStatus, UnitStatusType } from './status';
import { UnitDance } from './UnitDance';
import { UnitEffect } from './UnitEffect';
import { UnitLocation } from './UnitLocation';
import { UnitTimer } from './UnitTimer';
import { UnitType } from './UnitType';

export class Unit
{
    private _id: number;
    private _type: UnitType;

    private _user: User;
    private _bot: Bot;
    private _pet: Pet;

    private _connectedUnit: Unit;

    private _room: Room;
    private _roomLoading: Room;
    private _roomQueue: Room;
    private _location: UnitLocation;
    private _timer: UnitTimer;

    private _isIdle: boolean;
    private _lastChat: number;
    private _canLocate: boolean;
    private _isSpectating: boolean;

    private _needsUpdate: boolean;
    private _needsInvoke: boolean;
    private _skipUpdate: boolean;
    private _isResetting: boolean;

    constructor(type: UnitType, instance: User | Pet | Bot = null)
    {
        if(!type) throw new Error('invalid_type');

        this._id    = NumberHelper.generateNumber();
        this._type  = type;
        this._user  = null;
        this._bot   = null;
        this._pet   = null;

        if(type === UnitType.USER)
        {
            if(!(instance instanceof User)) throw new Error('invalid_user');

            this._user = instance;
        }

        if(type === UnitType.BOT)
        {
            if(!(instance instanceof Bot)) throw new Error('invalid_bot');

            this._bot = instance;
        }

        if(type === UnitType.PET)
        {
            if(!(instance instanceof Pet)) throw new Error('invalid_pet');

            this._pet = instance;
        }

        this._connectedUnit = null;

        this._room          = null;
        this._roomLoading   = null;
        this._roomQueue     = null;
        this._location      = new UnitLocation(this);
        this._timer         = new UnitTimer(this);

        this._isIdle        = false;
        this._lastChat      = 0;
        this._canLocate     = true;
        this._isSpectating  = false;
        
        this._needsUpdate   = false;
        this._needsInvoke   = false;
        this._skipUpdate    = false;
        this._isResetting   = false;
    }

    public connectUnit(unit: Unit): void
    {
        this._connectedUnit = unit;

        unit.connectedUnit = this;

        if(unit.type === UnitType.PET)
        {
            this._location.effect(UnitEffect.HORSE_SADDLE);
                
            this._location.position.x = unit.location.position.x;
            this._location.position.y = unit.location.position.y;
            this._location.position.setDirection(unit.location.position.direction);

            this._location.additionalHeight = 1;

            this.needsUpdate = true;
        }
    }

    public async reset(sendHotelView: boolean = true): Promise<void>
    {
        if(!this._isResetting)
        {
            this._isResetting = true;

            this._timer.stopTimers();

            if(this._room) await this._room.unitManager.removeUnit(this, false);

            this._room      = null;
            this._roomQueue = null;

            if(this._location) this._location.reset();

            if(sendHotelView && this._user) this._user.connections.processOutgoing(new HotelViewComposer());

            this._canLocate     = true;
            this._needsUpdate   = false;
            this._needsInvoke   = false;
            this._skipUpdate    = false;
            this._isResetting   = false;
        }
    }

    public fowardRoom(id: number): void
    {
        if(id && this._type === UnitType.USER) this._user.connections.processOutgoing(new UserFowardRoomComposer(id));
    }

    public async enterRoomPartOne(id: number, password: string, skipStateCheck: boolean = false)
    {
        if(!id) return;

        const room = await Emulator.gameManager.roomManager.getRoom(id);

        if(!room) return this._user.connections.processOutgoing(new HotelViewComposer());

        await room.init();

        Emulator.gameManager.roomManager.addRoom(room);

        this._roomLoading = room;

        this._user.connections.processOutgoing(new RoomEnterComposer());

        if(this._isSpectating) this._user.connections.processOutgoing(new RoomSpectatorComposer());

        this._user.connections.processOutgoing(new RoomModelNameComposer(room));
    }

    public async enterRoomPartTwo(): Promise<void>
    {
        const room = this._roomLoading;

        if(!room) return;

        // if(this._location.teleporting)
        // {
        //     if(this._location.teleporting.teleportGoal.roomId === id)
        //     {
        //         position = new Position(this._location.teleporting.teleportGoal.position.x, this._location.teleporting.teleportGoal.position.y);

        //         position.setDirection(this._location.teleporting.teleportGoal.position.direction);

        //         skipStateCheck = true;
        //     }
        // }

        await room.unitManager.addUnit(this);
    }

    public isOwner(): boolean
    {
        if(this._type !== UnitType.USER || !this._room) return false;

        if(this._room.details.ownerId !== this._user.id) return false;

        if(this._user.hasPermission(PermissionList.ANY_ROOM_OWNER)) return true;

        return true;
    }

    public spectate(status: boolean = false): void
    {
        if(this._type !== UnitType.USER) return;

        this._isSpectating = status;

        if(this._room)
        {
            if(status)
            {
                let roomId = this._room.id + 0;

                this._room.unitManager.removeUnit(this, true, false);

                this.fowardRoom(roomId);
            }
            else this._room.unitManager.removeUnit(this, true, true);
        }
    }

    public loadRights(): void
    {
        if(!this._room) return;

        let rightsType: RoomRightsType = RoomRightsType.NONE;

        if(this.isOwner())
        {
            console.log('owner');
            rightsType = RoomRightsType.MODERATOR;

            this._user.connections.processOutgoing(new RoomOwnerComposer());
        }
        else if(this.hasRights())
        {
            rightsType = RoomRightsType.RIGHTS;
        }

        this._user.connections.processOutgoing(new RoomRightsComposer(rightsType));

        this._location.addStatus(new UnitStatus(UnitStatusType.FLAT_CONTROL, rightsType.toString()));

        if(this.isOwner()) this._user.connections.processOutgoing(new RoomRightsListComposer(this._room));

        //this._user.connections.processOutgoing(new RoomInfoComposer(this._room, true));
    }

    public hasRights(): boolean
    {
        if(!this.isOwner()) return false;

        if(!this._room || this._type !== UnitType.USER) return false;
        
        if(!this._room.securityManager.hasRights(this._user.id)) return false;
        
        return true;
    }

    public idle(status: boolean): void
    {
        if(!this._room) return;

        if(status && !this._isIdle)
        {
            this._location.dance(UnitDance.NONE);

            this._isIdle = true;

            this._room.unitManager.processOutgoing(new UnitIdleComposer(this));
        }
        
        else if(!status && this._isIdle)
        {
            this._isIdle = false;

            this._room.unitManager.processOutgoing(new UnitIdleComposer(this));
        }
    }

    public async dispose(): Promise<void>
    {
        await this.reset();
    }

    public get id(): number
    {
        return this._id;
    }

    public get type(): UnitType
    {
        return this._type;
    }

    public get room(): Room
    {
        return this._room;
    }

    public set room(room: Room)
    {
        this._room = room;
    }

    public get roomLoading(): Room
    {
        return this._roomLoading;
    }

    public set roomLoading(room: Room)
    {
        this._roomLoading = room;
    }

    public get roomQueue(): Room
    {
        return this._roomQueue;
    }

    public set roomQueue(room: Room)
    {
        this._roomQueue = room;
    }

    public get user(): User
    {
        return this._user;
    }

    public get bot(): Bot
    {
        return this._bot;
    }

    public get pet(): Pet
    {
        return this._pet;
    }

    public get connectedUnit(): Unit
    {
        return this._connectedUnit;
    }

    public set connectedUnit(unit: Unit)
    {
        this._connectedUnit = unit;
    }

    public get location(): UnitLocation
    {
        return this._location;
    }

    public get timer(): UnitTimer
    {
        return this._timer;
    }

    public get isIdle(): boolean
    {
        return this._isIdle;
    }

    public set isIdle(flag: boolean)
    {
        this._isIdle = flag;
    }

    public get lastChat(): number
    {
        return this._lastChat;
    }

    public set lastChat(timestamp: number)
    {
        this._lastChat = timestamp;
    }

    public get canLocate(): boolean
    {
        return this._canLocate;
    }

    public set canLocate(locate: boolean)
    {
        this._canLocate = locate;
    }

    public get isSpectating(): boolean
    {
        return this._isSpectating;
    }

    public get needsUpdate(): boolean
    {
        return this._needsUpdate;
    }

    public set needsUpdate(status: boolean)
    {
        this._needsUpdate = status;
    }

    public get needsInvoke(): boolean
    {
        return this._needsInvoke;
    }

    public set needsInvoke(status: boolean)
    {
        this._needsInvoke = status;
    }

    public get skipUpdate(): boolean
    {
        return this._skipUpdate;
    }

    public set skipUpdate(status: boolean)
    {
        this._skipUpdate = status;
    }
}