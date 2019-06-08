import { UnitActionComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer } from '../../packets';
import { Item } from '../item';
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

    private _goalAction: Function;

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

        this._goalAction        = null;
    }

    public walkTo(position: Position, selfWalk: boolean = false, inform: boolean = true, path: Position[] = null, direct: boolean = false): void
    {
        if(!this._unit || !this._unit.room || !this._position) return;

        if(this._position.compare(position)) return;
        
        if(this._unit.type === UnitType.USER) this._unit.timer.resetIdleTimer();

        if(!this._unit.canLocate && selfWalk) return;
        
        position = position.copy();
                
        this.processNextPosition();

        const goalTile = this._unit.room.map.getValidTile(this._unit, position);

        if(!goalTile) return this.stopWalking();
        
        const goalItem = goalTile.highestItem;

        if(goalItem)
        {
            if(goalItem.baseItem.canLay)
            {
                const closestPillow = this._unit.room.map.getClosestValidPillow(this._unit, position);

                if(closestPillow) if(!closestPillow.compare(position)) return this.walkTo(closestPillow);
            }
        }

        const positions = path ? path : direct ? [ position ] : PathFinder.makePath(this._unit, position);

        if(!positions.length) return this.stopWalking();
        
        this._positionGoal  = position;
        this._currentPath   = positions;
        this._isWalking     = true;
        this._isWalkingSelf = selfWalk;

        if(this._unit.connectedUnit && inform) this._unit.connectedUnit.location.walkTo(position, selfWalk, false, positions.slice(0));
    }

    public walkToUnit(unit: Unit, selfWalk: boolean = false): void
    {
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

            return this.walkTo(position, selfWalk);
        }
    }

    public sit(flag: boolean = true, height: number = 0.50, direction: Direction = null): void
    {
        if(!this._unit || !this._unit.room) return;

        if(flag)
        {
            if(this._unit.connectedUnit) return;

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
            if(this._unit.connectedUnit) return;

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

        if(this._unit.connectedUnit) return;

        if(this.hasStatus(UnitStatusType.SIT, UnitStatusType.LAY)) return;

        if(this._danceType === dance) return;

        if(this._unit.type === UnitType.USER)
        {
            if(this._danceType > UnitDance.NORMAL && !this._unit.user.details.clubActive) return;
        }

        this._danceType = dance;

        this._unit.room.unitManager.processOutgoing(new UnitDanceComposer(this._unit));
    }

    public effect(effect: UnitEffect): void
    {
        if(!this._unit || !this._unit.room) return;

        if(this._unit.connectedUnit && effect !== UnitEffect.HORSE_SADDLE) return;

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

    public roam(): void
    {
        if(!this._unit || !this._unit.room || !this._unit.room.map) return;

        const randomTile = this._unit.room.map.getValidRandomTile(this._unit);

        if(!randomTile) return;

        this._unit.location.walkTo(randomTile.position);
    }

    public action(action: UnitAction): void
    {
        if(!this._unit || !this._unit.room) return;

        if(this._unit.type === UnitType.USER)
        {
            if(action === UnitAction.BLOW_KISS || action === UnitAction.LAUGH)
            {
                if(!this._unit.user.details.clubActive) return;
            }
        }

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

    public invokeCurrentItem(): void
    {
        if(!this._unit || !this._unit.room) return;

        this.updateHeight(this._position);

        const currentItem = this.getCurrentItem();

        if(!currentItem || !currentItem.baseItem.canSit || !currentItem.baseItem.canLay)
        {
            this.sit(false);
            this.lay(false);
        }

        if(currentItem)
        {
            const interaction: any = currentItem.baseItem.interaction;

            if(interaction) if(interaction.onStop) interaction.onStop(this._unit, currentItem);
        }

        this.updateHeight(this._position);
        
        this._unit.needsInvoke = false;
    }

    public updateHeight(position: Position): void
    {
        if(!this._unit || !this._unit.room) return;
        
        const tile = this._unit.room.map.getTile(position);

        if(!tile) return;
        
        const height      = tile.walkingHeight;
        const oldHeight   = this._position.z;

        if(height === oldHeight) return;
        
        this._position.z        = height;
        this._unit.needsUpdate  = true;
    }

    public processNextPosition(): void
    {
        if(!this._unit || !this._unit.room || !this._unit.room.model) return;

        if(!this._positionNext) return;

        if(this._unit.type === UnitType.USER)
        {
            if(this._positionNext.compare(this._unit.room.model.doorPosition)) return this._unit.reset();
        }
        
        this._position.x    = this._positionNext.x;
        this._position.y    = this._positionNext.y;

        this.updateHeight(this._position);

        const currentItem = this.getCurrentItem();

        if(!currentItem) return;
        
        const interaction: any = currentItem.baseItem.interaction;

        if(!interaction) return;
        
        if(interaction.onStep) interaction.onStep(this._unit, currentItem);

        this._unit.needsUpdate = true;
    }

    public clearPath(): void
    {
        this._currentPath   = [];
    }

    private clearWalking(): void
    {
        this.clearPath();

        this.processNextPosition();

        this.doGoalAction();

        this._isWalking     = false;
        this._isWalkingSelf = true;
        this._positionNext  = null;
        this._positionGoal  = null;

        this._unit.needsUpdate = true;

        this.removeStatus(UnitStatusType.MOVE);
    }

    public stopWalking(): void
    {
        this.clearWalking();

        if(this._unit.type === UnitType.USER)
        {
            if(this._unit.connectedUnit)
            {
                if(this._position.direction !== this._unit.connectedUnit.location.position.direction)
                {
                    this._position.setDirection(this._unit.connectedUnit.location.position.direction);

                    this._unit.needsUpdate = true;
                }

                this._unit.connectedUnit.location.clearWalking();

                this._unit.connectedUnit.location.position.x = this._position.x + 0;
                this._unit.connectedUnit.location.position.y = this._position.y + 0;

                this._unit.connectedUnit.location.updateHeight(this._unit.connectedUnit.location.position);

                this._unit.connectedUnit.needsUpdate = true;
            }
        }
        
        this.invokeCurrentItem();
    }

    public setGoalAction(f: Function): void
    {
        if(!f)
        {
            this._goalAction = null;

            return;
        }

        this._goalAction = f;
    }

    public doGoalAction(): void
    {
        if(!this._goalAction) return;

        this._goalAction();

        this.setGoalAction(null);
    }

    public lookAtPosition(position: Position, headOnly: boolean = false, selfActivated: boolean = false): void
    {
        if(!position || !this._unit.room) return;

        if(!selfActivated && this._unit.isIdle) return;

        if(this._position.compare(position)) return;

        if(this.hasStatus(UnitStatusType.LAY)) return;

        if(this.hasStatus(UnitStatusType.SIT)) headOnly = true;

        if(!selfActivated && this._unit.isIdle) return;

        if(selfActivated) this._unit.timer.resetIdleTimer();

        if(headOnly)
        {
            this._position.headDirection = this._position.calculateHeadDirection(position);

            this._unit.timer.startLookTimer();
        }
        else
        {
            this._position.setDirection(this._position.calculateHumanDirection(position));
        }

        this._unit.updateNow();
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