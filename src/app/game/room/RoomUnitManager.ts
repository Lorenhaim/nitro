import { Emulator } from '../../Emulator';
import { DoorbellAddUserComposer, DoorbellCloseComposer, ItemFloorComposer, ItemWallComposer, Outgoing, RoomAccessDeniedComposer, RoomInfoComposer, RoomInfoOwnerComposer, RoomPaintComposer, RoomPromotionComposer, RoomScoreComposer, RoomThicknessComposer, UnitComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitIdleComposer, UnitRemoveComposer, UnitStatusComposer } from '../../packets';
import { Position } from '../pathfinder';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { RoomPaintType } from './interfaces';

export class RoomUnitManager
{
    private _room: Room;
    private _units: Unit[];
    private _unitQueue: Unit[];

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room          = room;
        this._units         = [];
        this._unitQueue     = [];

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public init()
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading     = true;

            this._isLoaded      = true;
            this._isLoading     = false;
            this._isDisposed    = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing = true;

            const totalUnits = this._units.length;

            if(totalUnits) for(let i = 0; i < totalUnits; i++) await this._units[i].reset();

            const totalQueue = this._unitQueue.length;

            if(totalQueue > 0) for(let i = 0; i < totalQueue; i++) await this._unitQueue[i].reset();

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
    }

    public getUnit(id: number): Unit
    {
        if(id > 0)
        {
            const totalUnits = this._units.length;

            if(totalUnits > 0)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const activeUnit = this._units[i];

                    if(activeUnit.id === id) return activeUnit;
                }
            }
        }

        return null;
    }

    public async addUnit(unit: Unit, position: Position = null, password: string = null, skipStateCheck: boolean = false): Promise<void>
    {
        if(!unit) return;

        const room = Emulator.gameManager.roomManager.addRoom(this._room);

        if(room !== this._room) return await room.unitManager.addUnit(unit, position, password, skipStateCheck);

        await this._room.init();

        if(unit.type === UnitType.USER)
        {
            if(unit.roomLoading !== this._room) return;
        }
        
        await unit.reset(false);
            
        unit.room               = this._room;
        unit.location.position  = position ? position : this._room.model.doorPosition.copy();

        console.log(unit.location.position);

        this.processOutgoing(new UnitComposer(unit), new UnitStatusComposer(unit));

        this._units.push(unit);

        this._room.details.setUsersNow(this._units.length); // dont for pets

        const pendingOutgoing: Outgoing[] = [];

        if(unit.type === UnitType.USER && unit.user)
        {
            unit.loadRights();
            
            pendingOutgoing.push(
                new RoomPaintComposer(room, RoomPaintType.LANDSCAPE),
                new RoomPaintComposer(room, RoomPaintType.FLOOR),
                new RoomPaintComposer(room, RoomPaintType.WALLPAPER),
                new RoomScoreComposer(100, false),
                new RoomPromotionComposer(),
                new UnitComposer(...this._units),
                new UnitStatusComposer(...this._units),
                new RoomInfoOwnerComposer(this._room),
                new RoomThicknessComposer(this._room),
                new RoomInfoComposer(this._room, false, true),
                new ItemWallComposer(this._room),
                new ItemFloorComposer(this._room));

            const totalUnits = this._units.length;

            if(totalUnits > 0)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const activeUnit = this._units[i];

                    if(activeUnit.location.danceType) pendingOutgoing.push(new UnitDanceComposer(activeUnit));

                    if(activeUnit.location.handType) pendingOutgoing.push(new UnitHandItemComposer(activeUnit));

                    if(activeUnit.location.effectType) pendingOutgoing.push(new UnitEffectComposer(activeUnit));

                    if(activeUnit.isIdle) pendingOutgoing.push(new UnitIdleComposer(activeUnit));
                }
            }

            if(pendingOutgoing.length) unit.user.connections.processOutgoing(...pendingOutgoing);
        }
        
        unit.timer.startTimers();
    }

    public async removeUnit(unit: Unit, runReset: boolean = true, sendHotelView: boolean = true): Promise<void>
    {
        console.log(unit);
        if(!unit) return;
        
        const totalUnits = this._units.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++)
        {
            const foundUnit = this._units[i];

            if(!foundUnit) continue;

            if(foundUnit.id !== unit.id) continue;
            
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

            this._units.splice(i, 1);

            this._room.details.setUsersNow(this._units.length);

            break;
        }

        this._room.tryDispose();
    }

    private addQueuingUnit(unit: Unit): void
    {
        this._unitQueue.push(unit);

        unit.roomQueue = this._room;

        unit.user.connections.processOutgoing(new DoorbellAddUserComposer());
    }

    public async acceptQueuingUnit(username: string): Promise<void>
    {
        const totalQueuing = this._unitQueue.length;

        if(totalQueuing)
        {
            for(let i = 0; i < totalQueuing; i++)
            {
                const queuingUnit = this._unitQueue[i];

                if(queuingUnit.user.details.username === username)
                {
                    const totalUnits = this._units.length;

                    if(totalUnits)
                    {
                        for(let j = 0; j < totalUnits; j++)
                        {
                            const activeUnit = this._units[i];

                            if(activeUnit.hasRights) activeUnit.user.connections.processOutgoing(new DoorbellCloseComposer(queuingUnit.user.details.username));
                        }
                    }

                    queuingUnit.user.connections.processOutgoing(new DoorbellCloseComposer());

                    await this.addUnit(queuingUnit, null, null, true);

                    this._unitQueue.splice(i, 1);
                }
            }
        }
    }

    public async removeQueuingUnit(unit: Unit, username: string = null, runReset: boolean = true, wasAccepted: boolean = true): Promise<void>
    {
        if(unit || username)
        {
            const totalQueuing = this._unitQueue.length;

            if(totalQueuing)
            {
                for(let i = 0; i < totalQueuing; i++)
                {
                    const queuingUnit = this._unitQueue[i];

                    if(unit && queuingUnit.id === unit.id || username && queuingUnit.user.details.username === username)
                    {
                        const totalUnits = this._units.length;

                        if(totalUnits)
                        {
                            for(let j = 0; j < totalUnits; j++)
                            {
                                const activeUnit = this._units[j];

                                if(activeUnit.hasRights) activeUnit.user.connections.processOutgoing(new DoorbellCloseComposer(queuingUnit.user.details.username));
                            }
                        }

                        if(!wasAccepted) queuingUnit.user.connections.processOutgoing(new RoomAccessDeniedComposer());

                        if(runReset) await queuingUnit.reset();

                        this._unitQueue.splice(i, 1);

                        return;
                    }
                }
            }
        }
    }

    public processOutgoing(...composers: Outgoing[]): void
    {
        const totalUnits = this._units.length;

        if(totalUnits > 0)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = this._units[i];

                if(unit.type === UnitType.USER && unit.user !== null)
                {
                    if(unit.user.connections !== null && unit.user.connections.gameClient !== null) unit.user.connections.processOutgoing(...composers);
                }
            }
        }
    }

    public updateUnitsAt(...positions: Position[]): void
    {
        const updatedPositions      = [ ...positions ];
        const updatedUnits: Unit[]  = [];

        if(updatedPositions)
        {
            const totalPositions = updatedPositions.length;

            if(totalPositions)
            {
                for(let i = 0; i < totalPositions; i++)
                {
                    const tile = this._room.map.getTile(updatedPositions[i]);

                    if(tile) updatedUnits.push(...tile.units);
                }
            }
        }

        if(updatedUnits)
        {
            const totalUnits = updatedUnits.length;

            if(totalUnits) for(let i = 0; i < totalUnits; i++) updatedUnits[i].location.invokeCurrentItem();
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get units(): Unit[]
    {
        return this._units;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}