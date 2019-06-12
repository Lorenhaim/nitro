import { NumberHelper, TimeHelper } from '../../common';
import { Nitro } from '../../Nitro';
import { HotelViewComposer, RoomAccessDeniedComposer, RoomDoorbellAddUserComposer, RoomDoorbellCloseComposer, RoomEnterComposer, RoomEnterErrorComposer, RoomModelNameComposer, RoomOwnerComposer, RoomRightsComposer, RoomRightsListComposer, RoomSpectatorComposer, UnitActionComposer, UnitChatComposer, UnitChatShoutComposer, UnitChatWhisperComposer, UnitIdleComposer, UnitStatusComposer, UserFowardRoomComposer } from '../../packets';
import { Bot } from '../bot';
import { GroupRank } from '../group';
import { WiredTriggerSaysSomething } from '../item';
import { Position } from '../pathfinder';
import { Pet } from '../pet';
import { ChatBubble, ChatType, Room, RoomEnterError, RoomRightsType, RoomState } from '../room';
import { PermissionList } from '../security';
import { User } from '../user';
import { UnitStatus, UnitStatusType } from './status';
import { UnitAction } from './UnitAction';
import { UnitDance } from './UnitDance';
import { determineEmotion, UnitEmotion } from './UnitEmotion';
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
    private _isRoomLoading: boolean;
    private _roomQueue: Room;
    private _location: UnitLocation;
    private _timer: UnitTimer;

    private _isIdle: boolean;
    private _idleStart: number;
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
        this._isRoomLoading = false;
        this._roomQueue     = null;
        this._location      = new UnitLocation(this);
        this._timer         = new UnitTimer(this);

        this._isIdle        = false;
        this._idleStart     = 0;
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
        if(this._connectedUnit)
        {
            this._connectedUnit._connectedUnit  = unit;
            this._connectedUnit                 = unit;
        }
        else
        {
            this._connectedUnit = unit;

            if(unit) unit._connectedUnit = this;
        }
    }

    public reset(sendHotelView: boolean = true): void
    {
        if(!this._isResetting)
        {
            this._isResetting = true;

            this._timer.stopTimers();

            if(this._room) this._room.unitManager.removeUnit(this, false);

            if(this._roomQueue)
            {
                this._roomQueue.unitManager.removeQueue(this);

                if(sendHotelView && this._user) this._user.connections.processOutgoing(new RoomAccessDeniedComposer());
            }

            this._room          = null;
            this._roomQueue     = null;
            this._isRoomLoading = false;

            if(this._location) this._location.reset();

            this.connectUnit(null);

            if(this._user)
            {
                if(sendHotelView)
                {
                    this._user.connections.processOutgoing(new HotelViewComposer());

                    this._isSpectating = false;
                }

                this._user.messenger.updateAllFriends();
            }

            this._isIdle        = false;
            this._idleStart     = 0;
            this._lastChat      = 0;
            this._canLocate     = true;
            this._needsUpdate   = false;
            this._needsInvoke   = false;
            this._skipUpdate    = false;
            this._isResetting   = false;
        }
    }

    public updateNow(): void
    {
        if(!this._room) return;

        return this._room.unitManager.processOutgoing(new UnitStatusComposer(this));
    }

    public fowardRoom(id: number): void
    {
        if(!id) return;

        if(this._room && this._room.id === id) return;

        if(this._type === UnitType.USER)
        {
            this._user.connections.processOutgoing(new UserFowardRoomComposer(id));
        }

        else if(this._type === UnitType.PET)
        {
            console.log('send the pet another way');
        }
    }

    public async enterRoomPartOne(id: number, password: string, skipStateCheck: boolean = false)
    {
        if(!id) return;

        if(this._isRoomLoading) return;

        this._isRoomLoading = true;

        this.reset(false);

        const room = await Nitro.gameManager.roomManager.getRoom(id);

        if(!room) return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.NO_ENTRY));

        await room.init();

        if(!room.isLoaded) return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.NO_ENTRY));

        this._roomLoading = room;

        if(this._location.teleporting)
        {
            if(this._location.teleporting.teleportGoal)
            {
                if(this._location.teleporting.teleportGoal.room === room) skipStateCheck = true;
                else
                {
                    this._location.teleporting.setInvalid();
                    this._location.teleporting.stopTeleporting();
                }
            }
            else
            {
                this._location.teleporting.setInvalid();
                this._location.teleporting.stopTeleporting();
            }
        }

        if(!room.securityManager.hasRights(this._user))
        {
            if(!this._user.hasPermission(PermissionList.ENTER_FULL_ROOMS))
            {
                if(room.details.usersNow >= room.details.usersMax) return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.ROOM_FULL));
            }

            if(!skipStateCheck && !this._user.hasPermission(PermissionList.IGNORE_ROOM_STATE))
            {
                if(room.details.state === RoomState.LOCKED)
                {
                    const totalUnits = room.unitManager.units.length;

                    if(!totalUnits) return this._user.connections.processOutgoing(new RoomAccessDeniedComposer());

                    let foundUser = false;

                    for(let i = 0; i < totalUnits; i++)
                    {
                        const unit = room.unitManager.units[i];

                        if(!unit) continue;

                        if(unit.type !== UnitType.USER) continue;

                        if(!unit.hasRights()) continue;

                        unit.user.connections.processOutgoing(new RoomDoorbellAddUserComposer(this._user.details.username));

                        foundUser = true;
                    }

                    if(!foundUser) return this._user.connections.processOutgoing(new RoomAccessDeniedComposer());
                    else
                    {
                        room.unitManager.unitsQueuing.push(this);
                        
                        this._roomQueue = room;

                        return this._user.connections.processOutgoing(new RoomDoorbellAddUserComposer());
                    }
                }

                else if(room.details.state === RoomState.PASSWORD)
                {

                }

                else if(room.details.state === RoomState.INVISIBLE)
                {
                    if(!this._user.hasPermission(PermissionList.ENTER_INVISIBLE_ROOMS))
                    {
                        return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.NO_ENTRY));
                    }
                }
            }
        }

        this._user.connections.processOutgoing(new RoomEnterComposer());

        if(room.details.state === RoomState.LOCKED) this._user.connections.processOutgoing(new RoomDoorbellCloseComposer());

        if(this._isSpectating) this._user.connections.processOutgoing(new RoomSpectatorComposer());

        this._user.connections.processOutgoing(new RoomModelNameComposer(room));
    }

    public async enterRoomPartTwo(): Promise<void>
    {
        if(!this._roomLoading) return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.NO_ENTRY));

        const room = await Nitro.gameManager.roomManager.getRoom(this._roomLoading.id);

        await room.init();

        if(!room.isLoaded) return this._user.connections.processOutgoing(new RoomEnterErrorComposer(RoomEnterError.NO_ENTRY));

        let position: Position = null;

        if(this._location.teleporting)
        {
            if(this._location.teleporting.teleportGoal.room === this._roomLoading)
            {
                position = new Position(this._location.teleporting.teleportGoal.position.x, this._location.teleporting.teleportGoal.position.y, this._location.teleporting.teleportGoal.position.z);

                position.setDirection(this._location.teleporting.teleportGoal.position.direction);
            }
            else
            {
                this._location.teleporting.setInvalid();
                this._location.teleporting.stopTeleporting();
            }
        }

        room.unitManager.addUnit(this, position);

        this._isRoomLoading = false;
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

    public chatSelf(message: string): void
    {
        if(!this._room || !message) return;

        this._user.connections.processOutgoing(new UnitChatWhisperComposer({
            unit: this,
            message,
            emotion: UnitEmotion.NORMAL,
            bubble: ChatBubble.ALERT
        }));
    }

    // public chat(type: ChatType, message: string): void
    // {
    //     if(type === null || !message || !this._room) return;

    //     this._timer.resetIdleTimer();

    //     const emotion = determineEmotion(message);

    //     if(type === ChatType.WHISPER)
    //     {
    //         const username = message.substr(0, message.indexOf(' '));
            
    //         message = message.substr(message.indexOf(' '));

    //         if(!username || !message) return;

    //         const activeUser = Emulator.gameManager.userManager.getUserByUsername(username);

    //         if(!activeUser) return;

    //         if(activeUser.unit.room !== this._room) return;

    //         activeUser.unit.receiveChat(ChatType.WHISPER, this, message);
    //     }
    // }

    // public receiveChat(type: ChatType, unit: Unit, message: string): void
    // {
    //     if(type === null || !unit || !message || !this._room || this._type !== UnitType.USER) return;

    //     if(unit.room !== this._room) return;

    //     if(message.endsWith('o/'))
    //     {
    //         this._user.connections.processOutgoing(new UnitActionComposer(unit, UnitAction.WAVE));

    //         if(unit.type === UnitType.USER) unit.user.connections.processOutgoing(new UnitActionComposer(unit, UnitAction.WAVE));
    //     }
    // }

    public chat(type: ChatType, message: string): void
    {
        if(!message || !this._room) return;

        if(this._lastChat && this._lastChat > (TimeHelper.currentTimestamp - 250)) return;

        this._timer.resetIdleTimer();

        const emotion = determineEmotion(message);
        
        if(type === ChatType.WHISPER)
        {
            const username = message.substr(0, message.indexOf(' '));
            
            message = message.substr(message.indexOf(' '));

            if(!username || !message) return;

            const activeUser = Nitro.gameManager.userManager.getUserByUsername(username);

            if(!activeUser) return;

            if(activeUser.unit.room !== this._room) return;
            
            if(message.endsWith('o/')) activeUser.connections.processOutgoing(new UnitActionComposer(this, UnitAction.WAVE));

            activeUser.connections.processOutgoing(new UnitChatWhisperComposer({
                unit: this,
                message: message,
                emotion,
                bubble: ChatBubble.NORMAL
            }));

            if(this._type === UnitType.USER) this.user.connections.processOutgoing(new UnitChatWhisperComposer({
                unit: this,
                message: message,
                emotion,
                bubble: ChatBubble.NORMAL
            }));
        }
        else
        {
            const totalUnits = this._room.unitManager.units.length;

            if(!totalUnits) return;
            
            for(let i = 0; i < totalUnits; i++)
            {
                const activeUnit = this._room.unitManager.units[i];

                if(!activeUnit) continue;

                if(activeUnit.type !== UnitType.USER) continue;

                if(type !== ChatType.SHOUT && !this._location.position.isNear(activeUnit.location.position, this._room.details.chatDistance)) continue;
                
                if(message.endsWith('o/')) activeUnit.user.connections.processOutgoing(new UnitActionComposer(this, UnitAction.WAVE));

                if(activeUnit !== this) activeUnit.location.lookAtPosition(this._location.position, true);

                const chat = {
                    unit: this,
                    message,
                    emotion,
                    bubble: ChatBubble.NORMAL
                };

                if(type === ChatType.NORMAL) activeUnit.user.connections.processOutgoing(new UnitChatComposer(chat));
                else if(type === ChatType.SHOUT) activeUnit.user.connections.processOutgoing(new UnitChatShoutComposer(chat));
            }

            this.room.wiredManager.processTrigger(WiredTriggerSaysSomething, this._user, message);
        }

        this._lastChat = TimeHelper.currentTimestamp;
    }

    public isOwner(): boolean
    {
        if(this._type !== UnitType.USER || !this._room) return false;

        return this._room.securityManager.isOwner(this._user);
    }

    public isGroupAdmin(): boolean
    {
        if(this._type !== UnitType.USER || !this._room) return false;

        return this._room.group && this._room.group.isAdmin(this._user);
    }

    public hasRights(): boolean
    {
        if(this._type !== UnitType.USER || !this._room) return false;

        return this._room.securityManager.hasRights(this._user);
    }

    public loadRights(): void
    {
        if(!this._room) return;

        let rightsType: RoomRightsType = RoomRightsType.NONE;

        if(this.isOwner())
        {
            rightsType = RoomRightsType.MODERATOR;

            this._user.connections.processOutgoing(new RoomOwnerComposer());
        }
        else if(this.hasRights())
        {
            if(this._room.group)
            {
                const rank = this._user.inventory.groups.getMembershipRank(this._room.group.id);

                if(rank === GroupRank.ADMIN)        rightsType = RoomRightsType.GROUP_ADMIN;
                else if(rank === GroupRank.MEMBER)  rightsType = RoomRightsType.GROUP_RIGHTS;
            }
            else
            {
                rightsType = RoomRightsType.RIGHTS;
            }
        }

        this._user.connections.processOutgoing(new RoomRightsComposer(rightsType));

        this._location.addStatus(new UnitStatus(UnitStatusType.FLAT_CONTROL, rightsType.toString()));

        if(this.isOwner()) this._user.connections.processOutgoing(new RoomRightsListComposer(this._room));
    }

    public idle(status: boolean): void
    {
        if(!this._room || this._type !== UnitType.USER) return;

        if(status && !this._isIdle)
        {
            this._location.dance(UnitDance.NONE);

            this._isIdle = true;

            this._idleStart = TimeHelper.currentTimestamp;

            this._room.unitManager.processOutgoing(new UnitIdleComposer(this));
        }
        
        else if(!status && this._isIdle)
        {
            this._isIdle = false;

            this._idleStart = 0;

            this._room.unitManager.processOutgoing(new UnitIdleComposer(this));
        }
    }

    public async dispose(): Promise<void>
    {
        this.reset();
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

    public get idleStart(): number
    {
        return this._idleStart;
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