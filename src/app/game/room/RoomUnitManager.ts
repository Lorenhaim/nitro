import { Emulator } from '../../Emulator';
import { ItemFloorComposer, ItemWallComposer, Outgoing, RoomInfoComposer, RoomInfoOwnerComposer, RoomPaintComposer, RoomPromotionComposer, RoomScoreComposer, RoomThicknessComposer, UnitComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitIdleComposer, UnitRemoveComposer, UnitStatusComposer } from '../../packets';
import { WiredTriggerEnterRoom } from '../item';
import { Position } from '../pathfinder';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { RoomPaintType } from './interfaces';

export class RoomUnitManager
{
    private _room: Room;

    private _units: Unit[];
    
    private _unitQueue: Unit[];
    private _unitsSpectating: Unit[];

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._units             = [];

        this._unitQueue         = [];
        this._unitsSpectating   = [];
    }

    public dispose(): void
    {
        const totalUnits = this._units.length;

        if(totalUnits) for(let i = 0; i < totalUnits; i++) this._units[i].reset();

        const totalSpectating = this._unitsSpectating.length;

        if(totalSpectating) for(let i = 0; i < totalUnits; i++) this._unitsSpectating[i].reset();

        const totalQueue = this._unitQueue.length;

        if(totalQueue > 0) for(let i = 0; i < totalQueue; i++) this._unitQueue[i].reset();
    }

    public getUnit(id: number): Unit
    {
        if(!id) return null;
        
        const totalUnits = this._units.length;

        if(!totalUnits) return null;

        for(let i = 0; i < totalUnits; i++)
        {
            const activeUnit = this._units[i];

            if(activeUnit.id === id) return activeUnit;
        }

        return null;
    }

    public addUnit(unit: Unit, position: Position = null): void
    {
        if(!unit) return;

        const room = Emulator.gameManager.roomManager.addRoom(this._room);

        if(room !== this._room) return room.unitManager.addUnit(unit, position);

        if(unit.type === UnitType.USER && unit.roomLoading !== this._room) return;

        unit.reset(false);

        unit.room               = this._room;
        unit.roomLoading        = null;
        unit.location.position  = position ? position : this._room.model.doorPosition.copy();

        unit.canLocate = false;

        if(!unit.isSpectating)
        {
            this.processOutgoing(new UnitComposer(unit), new UnitStatusComposer(unit));

            this._units.push(unit);

            this.updateTotalUsers();
        }
        else this._unitsSpectating.push(unit);

        if(unit.type === UnitType.USER)
        {
            unit.loadRights();

            const pendingOutgoing: Outgoing[] = [];
            
            pendingOutgoing.push(
                new RoomPaintComposer(room, RoomPaintType.LANDSCAPE),
                new RoomPaintComposer(room, RoomPaintType.FLOOR),
                new RoomPaintComposer(room, RoomPaintType.WALLPAPER),
                new RoomScoreComposer(0, false),
                new RoomPromotionComposer(),
                new UnitComposer(...this._units),
                new UnitStatusComposer(...this._units),
                new RoomInfoOwnerComposer(this._room),
                new RoomThicknessComposer(this._room),
                new RoomInfoComposer(this._room, false, true),
                new ItemWallComposer(this._room),
                new ItemFloorComposer(this._room));

            const totalUnits = this._units.length;

            if(totalUnits)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const activeUnit = this._units[i];

                    if(!activeUnit) continue;

                    if(activeUnit.location.danceType) pendingOutgoing.push(new UnitDanceComposer(activeUnit));

                    if(activeUnit.location.handType) pendingOutgoing.push(new UnitHandItemComposer(activeUnit));

                    if(activeUnit.location.effectType) pendingOutgoing.push(new UnitEffectComposer(activeUnit));

                    if(activeUnit.isIdle) pendingOutgoing.push(new UnitIdleComposer(activeUnit));
                }
            }

            if(pendingOutgoing.length) unit.user.connections.processOutgoing(...pendingOutgoing);

            this.room.wiredManager.processTrigger(WiredTriggerEnterRoom, unit.user);

            unit.timer.startTimers();

            unit.canLocate = true;
        }
    }

    public removeUnit(unit: Unit, runReset: boolean = true, sendHotelView: boolean = true): Promise<void>
    {
        if(!unit) return;
        
        const totalUnits = this._units.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++)
        {
            const foundUnit = this._units[i];

            if(!foundUnit) continue;

            if(foundUnit !== unit) continue;
            
            this.processOutgoing(new UnitRemoveComposer(foundUnit.id));

            const currentItem = unit.location.getCurrentItem();

            if(currentItem)
            {
                const interaction: any = currentItem.baseItem.interaction;

                if(interaction)
                {
                    if(interaction.onLeave) interaction.onLeave(unit, currentItem);
                }
            }
            
            const currentTile = unit.location.getCurrentTile();

            if(currentTile) currentTile.removeUnit(unit);

            if(runReset) foundUnit.reset(sendHotelView);

            if(unit.isSpectating) this.removeSpectator(unit);
            else this._units.splice(i, 1);

            this.updateTotalUsers();

            break;
        }

        this._room.tryDispose();
    }

    private removeSpectator(unit: Unit): void
    {
        if(!unit) return;

        const totalUnitsSpectating = this._unitsSpectating.length;

        if(!totalUnitsSpectating) return;

        for(let i = 0; i < totalUnitsSpectating; i++)
        {
            const foundUnit = this._unitsSpectating[i];

            if(!foundUnit) continue;

            if(foundUnit !== unit) continue;

            this._unitsSpectating.splice(i, 1);

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

        const totalSpectating = this._unitsSpectating.length;

        if(!totalSpectating) return;
        
        for(let i = 0; i < totalSpectating; i++)
        {
            const unit = this._unitsSpectating[i];

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

        const totalUnits = updatedUnits.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++) updatedUnits[i].location.invokeCurrentItem();

        this.processOutgoing(new UnitStatusComposer(...updatedUnits));
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

        this.processOutgoing(new UnitStatusComposer(...validatedUnits));
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
}