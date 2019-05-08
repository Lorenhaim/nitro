import { Item } from '../item';
import { Unit } from './Unit';

export class UnitTeleporting
{
    private _unit: Unit;

    private _didFail: boolean;
    private _teleport: Item;
    private _teleportGoal: Item;

    private _stepOne: boolean;
    private _stepTwo: boolean;
    private _stepThree: boolean;
    private _stepFour: boolean;
    private _stepFive: boolean;
    private _stepSix: boolean;
    private _stepSeven: boolean;

    constructor(unit: Unit, didFail: boolean = false, teleport: Item, teleportGoal: Item)
    {
        if(didFail)
        {
            this._didFail = true;

            if(!(unit instanceof Unit) || !(teleport instanceof Item)) throw new Error('invalid_teleport');
        }
        else
        {
            this._didFail = false;
            if(!(unit instanceof Unit) || !(teleport instanceof Item) || !(teleportGoal instanceof Item)) throw new Error('invalid_teleport');
        }

        this._unit          = unit;

        this._teleport      = teleport;
        this._teleportGoal  = teleportGoal;

        this._stepOne       = false;
        this._stepTwo       = false;
        this._stepThree     = false;
        this._stepFour      = false;
        this._stepFive      = false;
        this._stepSix       = false;
        this._stepSeven     = false;
    }

    public processTeleport(): void
    {
        if(this._stepFive)
        {
            this._teleportGoal.getTile().addUnit(this._unit);
            
            if(!this._unit.location.position.compare(this._teleportGoal.position) || !this._teleportGoal.room.map.getValidTile(this._unit, this._teleportGoal.position.getPositionInfront()))
            {
                this._teleportGoal.setExtraData('0');

                this._unit.location.teleporting = null;

                this._unit.canLocate = true;
            }
        }

        else if(this._stepFour)
        {
            if(this._teleportGoal.extraData !== '1') this._teleportGoal.setExtraData('1');

            const positionFront = this._teleportGoal.position.getPositionInfront();

            if(!this._unit.location.position.compare(positionFront))
            {
                if(this._teleportGoal.room.map.getValidTile(this._unit, positionFront))
                {
                    this._unit.location.walkTo(positionFront, false);
                }
            }

            this._stepFive = true;
        }
        
        else if(this._stepThree)
        {
            if(this._teleport.extraData !== '0') this._teleport.setExtraData('0');

            if(this._teleportGoal.baseItem.canWalk)
            {
                const positionFront = this._teleportGoal.position.getPositionInfront();

                if(!this._unit.location.position.compare(positionFront))
                {
                    if(this._teleportGoal.room.map.getValidTile(this._unit, positionFront))
                    {
                        this._unit.location.walkTo(positionFront, false);
                    }
                }

                this._stepFive = true;

                return;
            }

            this._stepFour = true;
        }

        else if(this._stepTwo)
        {
            const goalRoom = this._teleportGoal.room;

            if(!goalRoom) return this.stopTeleporting();
            
            if(this._unit.room === goalRoom)
            {
                this._unit.location.position.x = this._teleportGoal.position.x;
                this._unit.location.position.y = this._teleportGoal.position.y;
                this._unit.location.position.setDirection(this._teleportGoal.position.direction);

                this._unit.needsUpdate = true;
            }
            else
            {
                this._unit.fowardRoom(this._teleportGoal.roomId);
            }

            this._stepThree = true;
        }

        else if(this._stepOne)
        {
            if(!this._unit.location.position.compare(this._teleport.position)) return this.stopTeleporting();

            if(!this._teleport.baseItem.canWalk) this._teleport.setExtraData('2');

            if(!this._teleportGoal.baseItem.canWalk) this._teleportGoal.setExtraData('2');
            else this._teleportGoal.setExtraData('1');

            this._stepTwo = true;
        }

        else if(!this._stepOne)
        {
            const room = this._teleport.room;

            if(!room) return this.stopTeleporting();

            if(this._unit.location.position.compare(this._teleport.position))
            {
                if(!this._teleport.baseItem.canWalk) this._teleport.setExtraData('0');

                this._stepOne = true;

                return;
            }

            this.stopTeleporting();
        }
    }

    public stopTeleporting(): void
    {
        if(this._teleport) this._teleport.setExtraData(0);

        if(this._teleportGoal) this._teleportGoal.setExtraData(0);

        this._unit.location.teleporting = null;
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