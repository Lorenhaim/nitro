import { ItemDao } from '../../database';
import { Emulator } from '../../Emulator';
import { Item } from '../item';
import { Position } from '../pathfinder';
import { Unit } from './Unit';

export class UnitTeleporting
{
    private _unit: Unit;

    private _teleport: Item;
    private _teleportGoal: Item;

    private _teleportPosition: Position;
    private _teleportGoalPosition: Position;

    private _isInvalid: boolean;
    private _isInvalidGoal: boolean;

    private _stepOne: boolean;
    private _stepTwo: boolean;
    private _stepThree: boolean;
    private _stepFour: boolean;

    constructor(unit: Unit, teleport: Item)
    {
        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        if(!(teleport instanceof Item)) throw new Error('invalid_teleport');

        this._unit          = unit;

        this._teleport      = teleport;
        this._teleportGoal  = null;

        this._isInvalid     = false;
        this._isInvalidGoal = false;

        this.resetSteps();
    }

    public processTeleport(): void
    {
        if(this._isInvalid || this._isInvalidGoal) return this.stopTeleporting();

        if(!this._teleport || !this._teleport.room) return this.stopTeleporting();

        if(!this._teleportGoal)
        {
            this._unit.location.setGoalAction(async () => await this.setupTeleports());

            return this._unit.location.doGoalAction();
        }

        if(this._stepFour)
        {
            return this.stopTeleporting();
        }

        else if(this._stepThree)
        {
            if(!this._unit.location.position.compare(this._teleportGoal.position)) return this.stopTeleporting();

            this._teleport.setExtraData(0);

            this._stepFour = true;
        }

        else if(this._stepTwo)
        {
            if(!this._unit.location.position.compare(this._teleport.position)) return this.stopTeleporting();

            if(!this._teleportGoal.room) return this.stopTeleporting();

            if(this._teleportGoal.room === this._teleport.room)
            {
                this._unit.location.getCurrentTile().removeUnit(this._unit);

                this._unit.location.position.x = this._teleportGoal.position.x;
                this._unit.location.position.y = this._teleportGoal.position.y;
                this._unit.location.position.z = this._teleportGoal.position.z;
                this._unit.location.position.setDirection(this._teleportGoal.position.direction);

                this._unit.location.getCurrentTile().addUnit(this._unit);

                this._unit.updateNow();
            }
            else
            {
                this._stepThree = true;
                
                return this._unit.fowardRoom(this._teleportGoal.room.id);
            }

            this._stepThree = true;
        }

        else if(this._stepOne)
        {
            if(!this._unit.location.position.compare(this._teleport.position)) return this.stopTeleporting();

            if(!this._teleport.baseItem.canWalk) this._teleport.setExtraData(2);

            if(!this._teleportGoal.baseItem.canWalk) this._teleportGoal.setExtraData(2);
            else this._teleportGoal.setExtraData(1);

            this._stepTwo = true;
        }

        else if(!this._stepOne)
        {
            this._unit.canLocate = false;

            if(!this._unit.location.position.compare(this._teleport.position)) return this.stopTeleporting();

            if(!this._teleport.baseItem.canWalk)
            {
                this._teleport.setExtraData(0);

                this._stepOne = true;
            }
            else
            {
                this._stepOne = true;

                this.processTeleport();
            }
        }
    }

    private resetSteps(): void
    {
        this._stepOne   = false;
        this._stepTwo   = false;
        this._stepThree = false;
        this._stepFour  = false;
    }

    public stopTeleporting(): void
    {
        this.resetSteps();

        if(this._teleport && this._unit.room !== this._teleport.room) this._isInvalid = true;
        if(this._teleportGoal && this._unit.room !== this._teleportGoal.room) this._isInvalid = true;

        if(this._isInvalid)
        {
            if(this._teleport) this._teleport.setExtraData(0);
            if(this._teleportGoal) this._teleportGoal.setExtraData(0);
            
            this._unit.location.teleporting = null;

            this._unit.canLocate = true;

            return;
        }

        if(this._teleport)
        {
            if(this._unit.location.position.compare(this._teleport.position))
            {
                this._teleport.setExtraData(1);

                const positionFront = this._teleport.position.getPositionInfront();

                if(!this._unit.location.position.compare(positionFront))
                {
                    if(this._teleport && this._teleport.room && this._teleport.room.map.getValidTile(this._unit, positionFront)) this._unit.location.walkTo(positionFront, false);
                }
            }
            else
            {
                this._teleport.setExtraData(0);
            }

            if(this._teleport.room) this._teleport.room.tryDispose();
        }

        if(this._teleportGoal)
        {
            if(this._unit.location.position.compare(this._teleportGoal.position))
            {
                this._teleportGoal.setExtraData(1);

                const positionFront = this._teleportGoal.position.getPositionInfront();

                if(!this._unit.location.position.compare(positionFront))
                {
                    if(this._teleportGoal && this._teleportGoal.room && this._teleportGoal.room.map.getValidTile(this._unit, positionFront)) this._unit.location.walkTo(positionFront, false);
                }
            }
            else
            {
                this._teleportGoal.setExtraData(0);
            }

            if(this._teleportGoal.room) this._teleportGoal.room.tryDispose();
        }

        this.setInvalid();
    }

    private setInvalid(): void
    {
        this._isInvalid = true;
    }

    private setInvalidGoal(): void
    {
        this._isInvalidGoal = true;
    }

    private async setupTeleports(): Promise<void>
    {
        if(!this._teleport) return this.setInvalidGoal();

        const room = this._teleport.room;

        if(!room) return this.setInvalidGoal();

        const pairingTeleport = await ItemDao.getTeleportPairing(this._teleport.id);
        
        if(!pairingTeleport) return this.setInvalidGoal();

        if(!pairingTeleport.teleportIdOne || !pairingTeleport.teleportIdTwo) return this.setInvalidGoal();

        let pairTeleportId  = 0;
        let pairRoomId      = 0;

        if(pairingTeleport.teleportIdOne === this._teleport.id)
        {
            pairTeleportId  = pairingTeleport.teleportIdTwo;
            pairRoomId      = pairingTeleport.teleportTwo.roomId;
        }

        else if(pairingTeleport.teleportIdTwo === this._teleport.id)
        {
            pairTeleportId  = pairingTeleport.teleportIdOne;
            pairRoomId      = pairingTeleport.teleportOne.roomId;
        }

        if(!pairTeleportId || !pairRoomId) return this.setInvalidGoal();

        const pairRoom = pairRoomId === this._teleport.roomId ? this._teleport.room : await Emulator.gameManager.roomManager.getRoom(pairRoomId);

        if(!pairRoom) return this.setInvalidGoal();

        await pairRoom.init();

        const teleportGoal = pairRoom.itemManager.getItem(pairTeleportId);

        if(!teleportGoal) return this.setInvalidGoal();

        this._teleportGoal = teleportGoal;
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public get teleport(): Item
    {
        return this._teleport;
    }

    public get teleportGoal(): Item
    {
        return this._teleportGoal;
    }
}