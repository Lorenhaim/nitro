import { Nitro } from '../../Nitro';
import { GroupBadgesComposer, ItemFloorComposer, ItemWallComposer, Outgoing, RoomDoorbellCloseComposer, RoomInfoComposer, RoomInfoOwnerComposer, RoomPaintComposer, RoomPromotionComposer, RoomScoreComposer, RoomThicknessComposer, RoomTradeErrorComposer, UnitComposer, UnitDanceComposer, UnitEffectComposer, UnitHandItemComposer, UnitIdleComposer, UnitRemoveComposer, UnitStatusComposer, UserFowardRoomComposer } from '../../packets';
import { Group } from '../group';
import { InteractionTeleport, WiredTriggerEnterRoom } from '../item';
import { Position } from '../pathfinder';
import { Room } from '../room';
import { Unit, UnitType } from '../unit';
import { RoomPaintType } from './interfaces';
import { TradeError, TradeSession } from './trading';

export class RoomUnitManager
{
    private _room: Room;

    private _units: Unit[];
    private _unitsQueuing: Unit[];

    private _tradeSessions: TradeSession[];

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room          = room;

        this._units         = [];
        this._unitsQueuing  = [];
        this._tradeSessions = [];
    }

    public dispose(): void
    {
        this.removeAllTrades();
        this.removeAllQueues();
        this.removeAllUnits();
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

    public getUnitByUsername(username: string): Unit
    {
        if(!username) return null;

        username = username.toLocaleLowerCase();
        
        const totalUnits = this._units.length;

        if(!totalUnits) return null;

        for(let i = 0; i < totalUnits; i++)
        {
            const activeUnit = this._units[i];

            if(!activeUnit) continue;

            if(activeUnit.type !== UnitType.USER) continue;

            if(activeUnit.user.details.username.toLocaleLowerCase() !== username) continue;

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

        this.processOutgoing(new UnitComposer(unit), new UnitStatusComposer(unit));

        this._units.push(unit);

        this.updateTotalUsers();

        const enterTile = unit.location.getCurrentTile();

        if(enterTile)
        {
            enterTile.addUnit(unit);

            if(!enterTile.hasInteraction(InteractionTeleport)) unit.needsInvoke = true;
        }

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
                            const group = Nitro.gameManager.groupManager.getActiveGroup(favoriteGroupId);

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

    public removeAllUnits(runReset: boolean = true, sendHotelView: boolean = true): void
    {
        if(this._units.length) for(let i = this._units.length - 1; i >= 0; i--) this.removeUnitAtIndex(i, runReset, sendHotelView, false);

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

            return this.removeUnitAtIndex(i, runReset, sendHotelView, updateRoom);
        }
    }

    private removeUnitAtIndex(i: number, runReset: boolean = true, sendHotelView: boolean = true, updateRoom: boolean = true): void
    {
        if(i === -1) return;

        const unit = this._units[i];

        if(!unit) return;

        const currentItem = unit.location.getCurrentItem();

        if(currentItem)
        {
            const interaction: any = currentItem.baseItem.interaction;

            if(interaction && interaction.onLeave) interaction.onLeave(unit, currentItem);
        }

        const currentTile = unit.location.getCurrentTile();

        if(currentTile) currentTile.removeUnit(unit);

        this._room.gameManager.removeUnitFromGames(unit);

        this.processOutgoing(new UnitRemoveComposer(unit.id));

        unit.room = null;

        if(runReset) unit.reset(sendHotelView);
            
        this._units.splice(i, 1);

        if(updateRoom)
        {
            this.updateTotalUsers();

            this._room.tryDispose();
        }
    }

    public removeAllQueues(): void
    {
        if(this._unitsQueuing.length) for(let i = this._unitsQueuing.length - 1; i >= 0; i--) this.removeQueueAtIndex(i);
    }

    public removeQueue(unit: Unit): void
    {
        if(!unit) return;

        const totalQueues = this._unitsQueuing.length;

        if(!totalQueues) return;

        for(let i = 0; i < totalQueues; i++)
        {
            const activeQueue = this._unitsQueuing[i];

            if(!activeQueue) continue;

            if(activeQueue !== unit) continue;

            return this.removeQueueAtIndex(i);
        }
    }

    private removeQueueAtIndex(i: number): void
    {
        if(i === -1) return;

        const unit = this._unitsQueuing[i];

        if(!unit) return;

        unit.roomQueue = null;

        this._room.securityManager.rightsOutgoing(new RoomDoorbellCloseComposer(unit.user.details.username));
            
        this._unitsQueuing.splice(i, 1);
    }

    public getTrade(unit: Unit): TradeSession
    {
        if(!unit) return null;

        const totalTrades = this._tradeSessions.length;

        if(!totalTrades) return null;

        for(let i = 0; i < totalTrades; i++)
        {
            const trade = this._tradeSessions[i];

            if(!trade) continue;

            const activeUnit = trade.getTrader(unit);

            if(!activeUnit) continue;

            return trade;
        }

        return null;
    }

    public startTrading(unit: Unit, target: Unit): void
    {
        if(!unit || !target) return;

        if(unit.type !== UnitType.USER || target.type !== UnitType.USER) return;

        if(unit.tradeUser) return unit.user.connections.processOutgoing(new RoomTradeErrorComposer(TradeError.TRADING_ACTIVE));

        if(target.tradeUser) return unit.user.connections.processOutgoing(new RoomTradeErrorComposer(TradeError.TARGET_TRADING_ACTIVE, target.user.details.username));

        const trade = new TradeSession(this._room);

        if(!trade) return;

        if(!trade.addTrader(unit) || !trade.addTrader(target)) trade.stopTrading(null, false);

        this._tradeSessions.push(trade);

        trade.startTrading();
    }

    public removeAllTrades(): void
    {  
        if(this._tradeSessions.length) for(let i = this._tradeSessions.length - 1; i >= 0; i--) this.removeTradeAtIndex(i);
    }

    public removeTrade(trade: TradeSession, notify: boolean = true): void
    {
        if(!trade) return;

        const totalTrades = this._tradeSessions.length;

        if(!totalTrades) return;

        for(let i = 0; i < totalTrades; i++)
        {
            const activeTrade = this._tradeSessions[i];

            if(!activeTrade) continue;

            if(activeTrade !== trade) continue;

            return this.removeTradeAtIndex(i, notify);
        }
    }

    private removeTradeAtIndex(i: number, notify: boolean = true): void
    {
        if(i === -1) return;

        const trade = this._tradeSessions[i];

        if(!trade) return;

        if(notify) trade.stopTrading(null, false);
            
        this._tradeSessions.splice(i, 1);
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