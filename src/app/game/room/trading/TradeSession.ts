import { Outgoing, RoomTradeCloseComposer, RoomTradeClosedComposer, RoomTradeCompleteComposer, RoomTradeComposer, RoomTradeUpdateComposer } from '../../../packets';
import { Unit, UnitStatus, UnitStatusType, UnitType } from '../../unit';
import { Room } from '../Room';
import { TradeClosed } from './TradeClosed';
import { TradeUser } from './TradeUser';

export class TradeSession
{
    private _room: Room;

    private _traders: TradeUser[];
    private _maxTraders: number;

    private _isLocked: boolean;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room          = room;

        this._traders       = [];
        this._maxTraders    = 2;

        this._isLocked      = false;
    }

    public getTrader(unit: Unit): TradeUser
    {
        if(!unit) return null;

        if(unit.type !== UnitType.USER) return null;

        const totalTraders = this._traders.length;

        if(!totalTraders) return null;

        for(let i = 0; i < totalTraders; i++)
        {
            const trader = this._traders[i];

            if(!trader) continue;

            if(trader.user !== unit.user) continue;

            return trader;
        }

        return null;
    }

    public hasTrader(unit: Unit): boolean
    {
        return this.getTrader(unit) !== null;
    }

    public addTrader(unit: Unit): TradeUser
    {
        if(!unit) return null;

        if(this._traders.length === this._maxTraders) return;

        if(unit.type !== UnitType.USER) return null;

        const activeTrader = this.getTrader(unit);

        if(activeTrader) return activeTrader;

        if(unit.tradeUser) unit.tradeUser.stopTrading();

        const tradeUser = new TradeUser(this, unit.user);

        if(!tradeUser) return null;

        this._traders.push(tradeUser);

        unit.tradeUser = tradeUser;

        return tradeUser;
    }

    public startTrading(): void
    {
        this.setTradeStatus();

        this.processOutgoing(new RoomTradeComposer(this));
    }

    public refreshTrade(): void
    {
        this.processOutgoing(new RoomTradeUpdateComposer(this));
    }

    private setTradeStatus(): void
    {
        const totalTraders = this._traders.length;

        if(!totalTraders) return;
        
        for(let i = 0; i < totalTraders; i++)
        {
            const trader = this._traders[i];

            if(!trader) continue;

            if(!trader.user) continue;

            trader.user.unit.location.addStatus(new UnitStatus(UnitStatusType.TRADING));
        }
    }

    public stopTrading(trader: TradeUser, notify: boolean = true): void
    {
        if(this._isLocked) return;

        const totalTraders = this._traders.length;

        if(!totalTraders) return;

        for(let i = 0; i < totalTraders; i++)
        {
            const activeTrader = this._traders[i];

            if(!activeTrader) continue;

            activeTrader.resetItems();

            activeTrader.user.unit.location.removeStatus(UnitStatusType.TRADING);

            activeTrader.user.connections.processOutgoing(new RoomTradeClosedComposer(trader ? trader.user.id : 0, TradeClosed.USER_CANCEL_TRADE));

            activeTrader.user.unit.tradeUser = null;
        }

        if(notify) this._room.unitManager.removeTrade(this, false);
    }

    public isAccepted(): boolean
    {
        const totalTraders = this._traders.length;

        if(!totalTraders) return false;

        let accepted = 0;

        for(let i = 0; i < totalTraders; i++)
        {
            const activeTrader = this._traders[i];

            if(!activeTrader) continue;

            if(!activeTrader.didAccept) continue;

            accepted++;
        }

        if(accepted === totalTraders) return true;

        return false;
    }

    public isConfirmed(): boolean
    {
        const totalTraders = this._traders.length;

        if(!totalTraders) return false;

        let confirmed = 0;

        for(let i = 0; i < totalTraders; i++)
        {
            const activeTrader = this._traders[i];

            if(!activeTrader) continue;

            if(!activeTrader.didConfirm) continue;

            confirmed++;
        }

        if(confirmed === totalTraders) return true;

        return false;
    }

    public finishTrade(): void
    {
        if(this._isLocked) return;

        if(!this.isConfirmed()) return;

        this._isLocked = true;

        const traderOne = this._traders[0];
        const traderTwo = this._traders[1];

        if(!traderOne || !traderTwo) return;

        if(!traderOne.user || !traderTwo.user) return;

        traderOne.user.inventory.items.addItem(...traderTwo.items);
        traderTwo.user.inventory.items.addItem(...traderOne.items);

        traderOne.user.unit.tradeUser = null;
        traderTwo.user.unit.tradeUser = null;

        this.processOutgoing(new RoomTradeCompleteComposer());
        this.processOutgoing(new RoomTradeCloseComposer());

        this._room.unitManager.removeTrade(this, false);
    }

    public processOutgoing(...composers: Outgoing[]): void
    {
        const totalTraders = this._traders.length;

        if(!totalTraders) return;
        
        for(let i = 0; i < totalTraders; i++)
        {
            const trader = this._traders[i];

            if(!trader) continue;

            if(!trader.user) continue;
            
            trader.user.connections.processOutgoing(...composers);
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get traders(): TradeUser[]
    {
        return this._traders;
    }

    public get isLocked(): boolean
    {
        return this._isLocked;
    }
}