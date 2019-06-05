import { Emulator } from '../../Emulator';
import { GroupBadgesComposer, ItemFloorComposer, ItemWallComposer, Outgoing, RoomDoorbellCloseComposer, RoomInfoComposer, RoomInfoOwnerComposer, RoomPaintComposer, RoomPromotionComposer, RoomScoreComposer, RoomThicknessComposer, UnitComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitIdleComposer, UnitRemoveComposer, UnitStatusComposer, UserFowardRoomComposer } from '../../packets';
import { Group } from '../group';
import { WiredTriggerEnterRoom } from '../item';
import { Position } from '../pathfinder';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { RoomPaintType } from './interfaces';

export class RoomUnitManager
{
    private _room: Room;

    private _units: Unit[];
    private _unitsQueuing: Unit[];

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._units             = [];
        this._unitsQueuing      = [];
    }

    public dispose(): void
    {
        const totalUnits = this._units.length;

        if(totalUnits) this.removeUnits(true, true, ...this._units);

        const totalQueues = this._unitsQueuing.length;

        if(totalQueues) this.removeQueues(...this._unitsQueuing);
    }

    public getUnit(id: number): Unit
    {
        if(!id) return null;
        
        const totalUnits = this._units.length;

        if(!totalUnits) return null;

        for(let i = 0; i < totalUnits; i++)
        {
            const activeUnit = this._units[i];

            if(!activeUnit) continue;

            if(activeUnit.id !== id) continue;

            return activeUnit;
        }

        return null;
    }

    public getUnitByUserId(userId: number): Unit
    {
        if(!userId) return null;
        
        const totalUnits = this._units.length;

        if(!totalUnits) return null;

        for(let i = 0; i < totalUnits; i++)
        {
            const activeUnit = this._units[i];

            if(!activeUnit) continue;

            if(activeUnit.type !== UnitType.USER) continue;

            if(activeUnit.user.id !== userId) continue;

            return activeUnit;
        }

        return null;
    }

    public hasUnit(id: number): boolean
    {
        return this.getUnit(id) !== null;
    }

    public addUnit(unit: Unit, position: Position = null): void
    {
        if(!unit) return;

        if(unit.type === UnitType.USER)
        {
            if(unit.roomLoading !== this._room) return;

            if(!this._room.isLoaded) return unit.user.connections.processOutgoing(new UserFowardRoomComposer(this._room.id));
        }

        unit.reset(false);

        if(this.hasUnit(unit.id)) return;

        unit.room               = this._room;
        unit.roomLoading        = null;
        unit.location.position  = position ? position : this._room.model.doorPosition.copy();
        unit.canLocate          = false;
        unit.needsInvoke        = true;

        this.processOutgoing(new UnitComposer(unit), new UnitStatusComposer(unit));

        this._units.push(unit);

        this.updateTotalUsers();

        const enterTile = unit.location.getCurrentTile();

        if(enterTile) enterTile.addUnit(unit);

        if(unit.type === UnitType.USER)
        {
            unit.user.messenger.updateAllFriends();
            
            unit.loadRights();

            const pendingOutgoing: Outgoing[] = [];
            
            pendingOutgoing.push(
                new RoomPaintComposer(this._room, RoomPaintType.LANDSCAPE),
                new RoomPaintComposer(this._room, RoomPaintType.FLOOR),
                new RoomPaintComposer(this._room, RoomPaintType.WALLPAPER),
                new RoomScoreComposer(this._room),
                new RoomPromotionComposer(this._room),
                new UnitComposer(...this._units),
                new UnitStatusComposer(...this._units),
                new RoomInfoOwnerComposer(this._room),
                new RoomThicknessComposer(this._room),
                new RoomInfoComposer(this._room, false, true),
                new ItemWallComposer(this._room),
                new ItemFloorComposer(this._room));

            const totalUnits = this._units.length;

            const groups: Group[] = [];

            if(totalUnits)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const activeUnit = this._units[i];

                    if(!activeUnit) continue;

                    if(activeUnit.type === UnitType.USER)
                    {
                        const favoriteGroupId = activeUnit.user.details.favoriteGroupId;

                        if(favoriteGroupId)
                        {
                            const group = Emulator.gameManager.groupManager.getActiveGroup(favoriteGroupId);

                            if(group) groups.push(group);
                        }
                    }

                    if(activeUnit.location.danceType) pendingOutgoing.push(new UnitDanceComposer(activeUnit));

                    if(activeUnit.location.handType) pendingOutgoing.push(new UnitHandItemComposer(activeUnit));

                    if(activeUnit.location.effectType) pendingOutgoing.push(new UnitEffectComposer(activeUnit));

                    if(activeUnit.isIdle) pendingOutgoing.push(new UnitIdleComposer(activeUnit));
                }
            }

            if(groups.length) pendingOutgoing.push(new GroupBadgesComposer(...groups));

            if(pendingOutgoing.length) unit.user.connections.processOutgoing(...pendingOutgoing);

            this.room.wiredManager.processTrigger(WiredTriggerEnterRoom, unit.user);
        }

        unit.timer.startTimers();

        unit.canLocate = true;
    }

    public removeUnits(runReset: boolean = true, sendHotelView: boolean = true, ...units: Unit[]): void
    {
        const removedUnits = [ ...units ];

        if(!removedUnits) return;

        const totalRemovedUnits = removedUnits.length;

        if(!totalRemovedUnits) return;

        for(let i = 0; i < totalRemovedUnits; i++)
        {
            const removedUnit = removedUnits[i];

            if(!removedUnit) continue;

            this.removeUnit(removedUnit, runReset, sendHotelView, false);
        }

        this.updateTotalUsers();

        this._room.tryDispose();
    }

    public removeUnit(unit: Unit, runReset: boolean = true, sendHotelView: boolean = true, updateRoom: boolean = true): void
    {
        if(!unit) return;

        const totalUnits = this._units.length;

        if(!totalUnits) return;

        for(let i = 0; i < totalUnits; i++)
        {
            const activeUnit = this._units[i];

            if(!activeUnit) continue;

            if(activeUnit !== unit) continue;

            const currentItem = activeUnit.location.getCurrentItem();

            if(currentItem)
            {
                const interaction: any = currentItem.baseItem.interaction;

                if(interaction && interaction.onLeave) interaction.onLeave(activeUnit, currentItem);
            }

            const currentTile = activeUnit.location.getCurrentTile();

            if(currentTile) currentTile.removeUnit(activeUnit);

            this.processOutgoing(new UnitRemoveComposer(activeUnit.id));

            activeUnit.room = null;

            if(runReset) activeUnit.reset(sendHotelView);
            
            this._units.splice(i, 1);

            if(updateRoom) this.updateTotalUsers();

            break;
        }

        if(updateRoom) this._room.tryDispose();
    }

    public removeQueues(...units: Unit[]): void
    {
        const removedQueues = [ ...units ];

        if(!removedQueues) return;

        const totalRemovedQueues = removedQueues.length;

        if(!totalRemovedQueues) return;

        for(let i = 0; i < totalRemovedQueues; i++)
        {
            const removedQueue = removedQueues[i];

            if(!removedQueue) continue;

            this.removeQueue(removedQueue);
        }
    }

    public removeQueue(unit: Unit): void
    {
        if(!unit) return;

        const totalQueue = this._unitsQueuing.length;

        if(!totalQueue) return;

        for(let i = 0; i < totalQueue; i++)
        {
            const foundUnit = this._unitsQueuing[i];

            if(!foundUnit) continue;

            if(foundUnit !== unit) continue;

            if(foundUnit.type !== UnitType.USER) continue;

            foundUnit.roomQueue = null;

            this._room.securityManager.rightsOutgoing(new RoomDoorbellCloseComposer(foundUnit.user.details.username));

            this._unitsQueuing.splice(i, 1);

            return;
        }
    }

    public processOutgoing(...composers: Outgoing[]): void
    {
        const totalUnits = this._units.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this._units[i];

            if(!unit) continue;

            if(unit.type !== UnitType.USER || !unit.user) continue;
            
            unit.user.connections.processOutgoing(...composers);
        }
    }

    public updateUnitsAt(...positions: Position[]): void
    {
        const updatedPositions      = [ ...positions ];
        const updatedUnits: Unit[]  = [];

        if(!updatedPositions) return;
        
        const totalPositions = updatedPositions.length;

        if(!totalPositions) return;
        
        for(let i = 0; i < totalPositions; i++)
        {
            const tile = this._room.map.getTile(updatedPositions[i]);

            if(tile) updatedUnits.push(...tile.units);
        }

        if(updatedUnits.length) this.updateUnits(...updatedUnits);
    }

    public updateUnits(...units: Unit[]): void
    {
        const updatedUnits              = [ ...units ];
        const validatedUnits: Unit[]    = [];

        if(!updatedUnits) return;
        
        const totalUnits = updatedUnits.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this.getUnit(updatedUnits[i].id);

            if(!unit) continue;

            validatedUnits.push(unit);
        }

        const totalValidated = validatedUnits.length;

        if(!totalValidated) return;
        
        for(let i = 0; i < totalValidated; i++)
        {
            const unit = validatedUnits[i];

            if(!unit) continue;

            unit.location.invokeCurrentItem();

            unit.needsUpdate = false;
        }

        if(validatedUnits.length) this.processOutgoing(new UnitStatusComposer(...validatedUnits));
    }

    public updateTotalUsers(): void
    {
        let result = 0;

        const totalUnits = this._units.length;

        if(!totalUnits) return this._room.details.setUsersNow(result);

        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this._units[i];

            if(!unit) continue;

            if(unit.type !== UnitType.USER) continue;

            result++;
        }

        this._room.details.setUsersNow(result);
    }

    public get room(): Room
    {
        return this._room;
    }

    public get units(): Unit[]
    {
        return this._units;
    }

    public get unitsQueuing(): Unit[]
    {
        return this._unitsQueuing;
    }
}