import { UnitActionComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitStatusComposer } from '../../packets';
import { Item } from '../item/Item';
import { Direction, PathFinder, Position } from '../pathfinder';
import { RoomTile } from '../room';
import { UnitStatus, UnitStatusType } from './status';
import { Unit } from './Unit';
import { UnitAction } from './UnitAction';
import { UnitDance } from './UnitDance';
import { UnitEffect } from './UnitEffect';
import { UnitHandItem } from './UnitHandItem';
import { UnitRolling } from './UnitRolling';
import { UnitSign } from './UnitSign';
import { UnitTeleporting } from './UnitTeleporting';
import { UnitType } from './UnitType';

export class UnitLocation
{
    private _unit: Unit;
    private _statuses: UnitStatus[];

    private _position: Position;
    private _positionGoal: Position;
    private _positionNext: Position;

    private _rolling: UnitRolling;
    private _teleporting: UnitTeleporting;

    private _currentPath: Position[];
    private _isWalking: boolean;
    private _isWalkingSelf: boolean;
    private _additionalHeight: number;
    private _danceType: UnitDance;
    private _handType: UnitHandItem;
    private _effectType: UnitEffect;

    private _clickGoal: { position: Position, item: Item};
    private _goalLook: Position;

    constructor(unit: Unit)
    {
        if(!(unit instanceof Unit)) throw new Error('invalid_unit');

        this._unit = unit;

        this.reset();
    }

    public reset(): void
    {
        this._statuses          = [];

        this._position          = null;
        this._positionGoal      = null;
        this._positionNext      = null;

        this._rolling           = null;

        this._currentPath       = [];
        this._isWalking         = false;
        this._isWalkingSelf     = true;
        this._additionalHeight  = 0;
        this._danceType         = null;
        this._handType          = null;
        this._effectType        = null;

        this._clickGoal         = null;
        this._goalLook          = null;
    }

    public walkTo(position: Position, selfWalk: boolean = false, goalLook: Position = null, inform: boolean = true): void
    {
        if(this._unit && this._unit.room && position)
        {
            if(this._unit.location.position.compare(position)) return;

            this._unit.timer.resetIdleTimer();

            if(this._unit.canLocate || !this._unit.canLocate && !selfWalk)
            {
                position = position.copy();
                
                if(this._positionNext)
                {
                    this._position.x    = this._positionNext.x;
                    this._position.y    = this._positionNext.y;

                    this.updateHeight(this._position);

                    const currentItem = this.getCurrentItem();

                    if(currentItem)
                    {
                        const interaction: any = currentItem.baseItem.interaction;

                        if(interaction)
                        {
                            if(interaction.onStep) interaction.onStep(this._unit, currentItem);
                        }
                    }
                }

                const goalTile = this._unit.room.map.getValidTile(this._unit, position);

                if(goalTile)
                {
                    const goalItem = goalTile.highestItem;

                    if(goalItem)
                    {
                        if(goalItem.baseItem.canLay)
                        {
                            const closestPillow = this._unit.room.map.getClosestValidPillow(this._unit, position);

                            if(closestPillow)
                            {
                                if(!closestPillow.compare(position)) return this.walkTo(closestPillow);
                            }
                        }
                    }

                    const positions = PathFinder.makePath(this._unit, position);

                    if(positions.length)
                    {
                        if(goalLook) this._goalLook = goalLook.copy();

                        // if(goalDirection === null) position.setDirection(-1);
                        // else position.setDirection(goalDirection);
                        
                        this._positionGoal  = position;
                        this._currentPath   = positions;
                        this._isWalking     = true;
                        this._isWalkingSelf = selfWalk;

                        if(this._unit.connectedUnit && inform)
                        {
                            this._unit.connectedUnit.location.walkTo(position, false, null, false);
                        }

                        return;
                    }
                }
                else
                {
                    this.stopWalking();
                }
            }
            else
            {
                this.stopWalking();
            }
        }
    }

    public walkToUnit(unit: Unit, selfWalk: boolean = false): void
    {
        console.log('walk!!');
        if(!unit || !this._unit.room || unit.room !== this._unit.room) return;

        const currentPosition = unit.location.position.copy();

        if(!currentPosition) return;

        const positions = unit.location.position.getPositionsAround();

        if(!positions) return;

        const totalPositions = positions.length;

        if(!totalPositions) return;

        for(let i = 0; i < totalPositions; i++)
        {
            const position = positions[i];

            if(!this._unit.room.map.getValidTile(this._unit, position)) continue;

            return this.walkTo(position, selfWalk, currentPosition);
        }
    }

    public sit(flag: boolean = true, height: number = 0.50, direction: Direction = null): void
    {
        if(!this._unit || !this._unit.room) return;

        if(flag)
        {
            if(this.hasStatus(UnitStatusType.SIT)) return;
            
            if(this._isWalking) this.stopWalking();
            if(this._danceType) this.dance(UnitDance.NONE);

            this._position.setDirection(direction !== null ? direction : this._position.calculateSitDirection());
            this.addStatus(new UnitStatus(UnitStatusType.SIT, height.toString()));
        }
        else
        {
            if(!this.hasStatus(UnitStatusType.SIT)) return;
            
            this.removeStatus(UnitStatusType.SIT);
        }
    }

    public lay(flag: boolean = true, height = 0.50, direction: Direction = null): void
    {
        if(!this._unit || !this._unit.room) return;

        if(flag)
        {
            if(this.hasStatus(UnitStatusType.LAY)) return;
            
            if(this._isWalking) this.stopWalking();
            if(this._danceType) this.dance(UnitDance.NONE);

            this._position.setDirection(direction !== null ? direction : this._position.calculateSitDirection());
            this.addStatus(new UnitStatus(UnitStatusType.LAY, height.toString()));
        }
        else
        {
            if(!this.hasStatus(UnitStatusType.LAY)) return;
            
            this.removeStatus(UnitStatusType.LAY);
        }
    }

    public sign(sign: UnitSign): void
    {
        if(!this._unit || !this._unit.room) return;
        
        if(this.hasStatus(UnitStatusType.LAY)) return;
        
        if(!sign || sign > 17) return;
            
        this.addStatus(new UnitStatus(UnitStatusType.SIGN, sign.toString()));
    }

    public dance(dance: UnitDance): void
    {
        if(!this._unit || !this._unit.room) return;

        if(!this._danceType && !dance) return;

        if(this.hasStatus(UnitStatusType.SIT, UnitStatusType.LAY)) return;

        if(this._danceType === dance) return;

        this._danceType = dance;

        this._unit.room.unitManager.processOutgoing(new UnitDanceComposer(this._unit));
    }

    public effect(effect: UnitEffect): void
    {
        if(!this._unit || !this._unit.room) return;

        if(!this._effectType && !effect) return;

        if(this._effectType === effect) return;

        this._effectType = effect;

        this._unit.room.unitManager.processOutgoing(new UnitEffectComposer(this._unit));
    }

    public hand(hand: UnitHandItem): void
    {
        if(!this._unit || !this._unit.room) return;

        if(!this._handType && !hand) return;

        this._handType = hand;

        if(hand === UnitHandItem.NONE) this._unit.timer.stopHandTimer();
        else this._unit.timer.startHandTimer();

        this._unit.room.unitManager.processOutgoing(new UnitHandItemComposer(this._unit));
    }

    public action(action: UnitAction): void
    {
        if(!this._unit || !this._unit.room) return;

        this._unit.room.unitManager.processOutgoing(new UnitActionComposer(this._unit, action));
    }

    public getStatus(type: UnitStatusType): UnitStatus
    {
        if(!type) return null;

        const totalStatuses = this._statuses.length;

        if(!totalStatuses) return null;

        for(let i = 0; i < totalStatuses; i++)
        {
            const status = this._statuses[i];

            if(status.key === type) return status;
        }

        return null;
    }

    public hasStatus(...types: UnitStatusType[]): boolean
    {
        if(!types) return false;

        const someTypes = [ ...types ];

        if(!someTypes) return false;

        const totalTypes    = someTypes.length;
        const totalStatuses = this._statuses.length;

        if(!totalTypes && !totalStatuses) return false;

        for(let i = 0; i < totalTypes; i++)
        {
            const type = someTypes[i];

            for(let j = 0; j < totalStatuses; j++)
            {
                const status = this._statuses[j];

                if(status && status.key === type) return true;
            }
        }

        return false;
    }

    public addStatus(...statuses: UnitStatus[]): void
    {
        if(!statuses) return;

        const someStatuses = [ ...statuses ];

        if(!someStatuses) return;

        const totalStatuses = someStatuses.length;

        if(!totalStatuses) return;
        
        for(let i = 0; i < totalStatuses; i++)
        {
            const status = someStatuses[i];

            this.removeStatus(status.key);

            this._statuses.push(status);
        }
        
        this._unit.needsUpdate = true;
    }

    public removeStatus(...types: UnitStatusType[]): void
    {
        if(!types) return;

        const someTypes = [ ...types ];

        if(!someTypes) return;
        
        const totalTypes    = someTypes.length;
        const totalStatuses = this._statuses.length;

        if(!totalTypes && !totalStatuses) return;
        
        for(let i = 0; i < totalTypes; i++)
        {
            const type = someTypes[i];

            for(let j = 0; j < totalStatuses; j++)
            {
                const status = this._statuses[j];

                if(!status || status.key !== type) continue;

                this._statuses.splice(j, 1);

                break;
            }
        }

        this._unit.needsUpdate = true;
    }

    public getCurrentTile(): RoomTile
    {
        return this._unit && this._unit.room && this._unit.room.map.getTile(this._position) || null;
    }

    public getCurrentItem(): Item
    {
        const currentTile = this.getCurrentTile();

        return currentTile && currentTile.highestItem || null;
    }

    public setClickGoal(position: Position, item: Item): void
    {
        if(position && item)
        {
            this._clickGoal = { position, item };
        }
        else
        {
            this._clickGoal = null;
        }
    }

    public invokeCurrentItem(): void
    {
        const currentTile = this.getCurrentTile();

        if(currentTile)
        {
            const height = currentTile.walkingHeight;

            if(height !== this._position.z)
            {
                this._position.z = height;

                this._unit.needsUpdate = true;
            }
        }

        const currentItem = this.getCurrentItem();

        if(!currentItem || !currentItem.baseItem.canSit || !currentItem.baseItem.canLay)
        {
            this.sit(false)
            this.lay(false);
        }

        if(currentItem)
        {
            const interaction: any = currentItem.baseItem.interaction;

            if(interaction) if(interaction.onStop && this._unit.type !== UnitType.PET) interaction.onStop(this._unit, currentItem);
        }

        this.updateHeight(this._position);
        this._unit.needsInvoke = false;
    }

    public fastInvoke(): void
    {
        if(this._unit.room)
        {
            setTimeout(() =>
            {
                this.invokeCurrentItem();

                if(this._unit.needsUpdate)
                {
                    this._unit.needsUpdate = false;
                    
                    this._unit.room.unitManager.processOutgoing(new UnitStatusComposer(this._unit));
                }
            }, 450);
        }
    }

    public updateHeight(position: Position): void
    {
        if(this._unit && this._unit.room)
        {
            const tile = this._unit.room.map.getTile(position);

            if(tile)
            {
                const height      = tile.walkingHeight;
                const oldHeight   = this._position.z;

                if(height !== oldHeight)
                {
                    this._position.z        = height;
                    this._unit.needsUpdate  = true;
                }
            }
        }
    }

    public clearPath(): void
    {
        this._currentPath   = [];
    }

    public stopWalking(): void
    {
        if(this._isWalking)
        {
            this.clearPath();

            if(this._positionGoal)
            {
                if(this._goalLook)
                {
                    this.lookAtPosition(this._goalLook);
                    
                    this._goalLook = null;
                }

                // if(this._positionGoal.direction !== -1)
                // {
                //     this._position.setDirection(this._positionGoal.direction);
                // }
            }

            this._positionGoal  = null;
            this._positionNext  = null;
            this._clickGoal     = null;
            this._isWalking     = false;
            this._isWalkingSelf = true;

            this.removeStatus(UnitStatusType.MOVE);

            this._unit.needsUpdate = true;

            this.invokeCurrentItem();
        }
    }

    public lookAtPosition(position: Position, headOnly: boolean = false, selfActivated: boolean = false): void
    {
        if(this._unit && this._unit.room)
        {
            if(selfActivated) this._unit.timer.resetIdleTimer();

            if(!selfActivated && this._unit.isIdle) return;
            
            if(this.hasStatus(UnitStatusType.LAY)) return;
            
            if(!this._position.compare(position))
            {
                if(this.hasStatus(UnitStatusType.SIT))
                {
                    this._position.headDirection = this._position.calculateHeadDirection(position);

                    this._unit.timer.startLookTimer();
                }
                else
                {
                    if(headOnly)
                    {
                        this._position.headDirection = this._position.calculateHeadDirection(position);

                        this._unit.timer.startLookTimer();
                    }
                    else this._position.setDirection(this._position.calculateHumanDirection(position));
                }

                this._unit.needsUpdate = true;
            }
        }
    }

    public get unit(): Unit
    {
        return this._unit;
    }

    public get statuses(): UnitStatus[]
    {
        return this._statuses;
    }

    public get position(): Position
    {
        return this._position;
    }

    public set position(position: Position)
    {
        this._position = position;
    }

    public get positionGoal(): Position
    {
        return this._positionGoal;
    }

    public set positionGoal(position: Position)
    {
        this._positionGoal = position;
    }

    public get positionNext(): Position
    {
        return this._positionNext;
    }

    public set positionNext(position: Position)
    {
        this._positionNext = position;
    }

    public get rolling(): UnitRolling
    {
        return this._rolling;
    }

    public set rolling(rolling: UnitRolling)
    {
        this._rolling = rolling;
    }

    public get teleporting(): UnitTeleporting
    {
        return this._teleporting;
    }

    public set teleporting(teleporting: UnitTeleporting)
    {
        this._teleporting = teleporting;
    }

    public get currentPath(): Position[]
    {
        return this._currentPath;
    }

    public set currentPath(path: Position[])
    {
        this._currentPath = path;
    }

    public get isWalking(): boolean
    {
        return this._isWalking;
    }

    public get isWalkingSelf(): boolean
    {
        return this._isWalkingSelf;
    }

    public get additionalHeight(): number
    {
        return this._additionalHeight;
    }

    public set additionalHeight(height: number)
    {
        this._additionalHeight = height;
    }

    public get clickGoal(): { position: Position, item: Item }
    {
        return this._clickGoal;
    }

    public get danceType(): UnitDance
    {
        return this._danceType;
    }

    public get handType(): UnitHandItem
    {
        return this._handType;
    }

    public get effectType(): UnitEffect
    {
        return this._effectType;
    }
}