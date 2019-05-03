import { Manager } from '../../common';
import { Emulator } from '../../Emulator';
import { ItemFloorComposer, ItemWallComposer, Outgoing, RoomInfoComposer, RoomInfoOwnerComposer, RoomPaintComposer, RoomPromotionComposer, RoomScoreComposer, RoomThicknessComposer, UnitComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitIdleComposer, UnitRemoveComposer, UnitStatusComposer } from '../../packets';
import { WiredTriggerEnterRoom } from '../item';
import { Position } from '../pathfinder';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { RoomPaintType } from './interfaces';

export class RoomUnitManager extends Manager
{
    private _room: Room;

    private _units: Unit[];
    private _unitsArtifical: Unit[];
    
    private _unitQueue: Unit[];
    private _unitsSpectating: Unit[];

    constructor(room: Room)
    {
        super('RoomUnitManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._units             = [];
        this._unitsArtifical    = [];

        this._unitQueue         = [];
        this._unitsSpectating   = [];
    }

    protected async onInit(): Promise<void>
    {

    }

    protected async onDispose(): Promise<void>
    {
        const totalUnits = this._units.length;

        if(totalUnits) for(let i = 0; i < totalUnits; i++) await this._units[i].reset();

        const totalSpectating = this._unitsSpectating.length;

        if(totalSpectating) for(let i = 0; i < totalUnits; i++) await this._unitsSpectating[i].reset();

        const totalQueue = this._unitQueue.length;

        if(totalQueue > 0) for(let i = 0; i < totalQueue; i++) await this._unitQueue[i].reset();
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

    public async addUnit(unit: Unit, position: Position = null): Promise<void>
    {
        if(!unit) return;

        const room = Emulator.gameManager.roomManager.addRoom(this._room);

        if(room !== this._room) return await room.unitManager.addUnit(unit, position);

        await this._room.init();

        if(unit.type === UnitType.USER && unit.roomLoading !== this._room) return;

        await unit.reset(false);

        unit.room               = this._room;
        unit.location.position  = position ? position : this._room.model.doorPosition.copy();

        if(!unit.isSpectating)
        {
            this.processOutgoing(new UnitComposer(unit), new UnitStatusComposer(unit));

            this._units.push(unit);

            this._room.details.setUsersNow(this._units.length - this._unitsArtifical.length);
        }
        else this._unitsSpectating.push(unit);

        if(unit.type === UnitType.BOT || unit.type === UnitType.PET)
        {
            this._unitsArtifical.push(unit);
        }
        else if(unit.type === UnitType.USER)
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
        }
    }

    public async removeUnit(unit: Unit, runReset: boolean = true, sendHotelView: boolean = true): Promise<void>
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

            if(runReset) await foundUnit.reset(sendHotelView);

            if(unit.type === UnitType.BOT || unit.type === UnitType.PET) this.removeUnitArtificial(unit);

            if(unit.isSpectating) this.removeSpectator(unit);

            this._units.splice(i, 1);

            this._room.details.setUsersNow(this._units.length - this._unitsArtifical.length);

            break;
        }

        this._room.tryDispose();
    }

    private removeUnitArtificial(unit: Unit): void
    {
        if(!unit) return;

        const totalUnits = this._unitsArtifical.length;

        if(!totalUnits) return;

        for(let i = 0; i < totalUnits; i++)
        {
            const foundUnit = this._unitsArtifical[i];

            if(!foundUnit) continue;

            if(foundUnit.id !== unit.id) continue;

            this._unitsArtifical.splice(i, 1);

            return;
        }
    }

    private removeSpectator(unit: Unit): void
    {
        if(!unit) return;

        const totalUnits = this._unitsSpectating.length;

        if(!totalUnits) return;

        for(let i = 0; i < totalUnits; i++)
        {
            const foundUnit = this._unitsSpectating[i];

            if(!foundUnit) continue;

            if(foundUnit.id !== unit.id) continue;

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