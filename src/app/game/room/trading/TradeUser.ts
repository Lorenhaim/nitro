import { RoomTradeAcceptedComposer, RoomTradeConfirmComposer } from '../../../packets';
import { Item } from '../../item';
import { User } from '../../user';
import { TradeSession } from './TradeSession';

export class TradeUser
{
    private _trade: TradeSession;
    private _user: User;

    private _items: Item[];

    private _didAccept: boolean;
    private _didConfirm: boolean;

    constructor(trade: TradeSession, user: User)
    {
        if(!(trade instanceof TradeSession)) throw new Error('invalid_trade');

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._trade         = trade;
        this._user          = user;
        
        this._items         = [];

        this._didAccept     = false;
        this._didConfirm    = false;
    }

    public getItem(id: number): Item
    {
        const totalItems = this._items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(item.id !== id) continue;
            
            return item;
        }

        return null;
    }

    public hasItem(id: number): boolean
    {
        return this.getItem(id) !== null;
    }

    public offerItems(...items: Item[]): void
    {
        if(this._trade.isLocked) return;

        const addedItems = [ ...items ];

        if(!addedItems) return;
        
        const totalItems = addedItems.length;

        if(!totalItems) return;
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = addedItems[i];

            if(!item) continue;

            if(this.hasItem(item.id)) continue;

            if(!this._user.inventory.items.hasItem(item.id)) continue;

            this._user.inventory.items.removeItem(item);

            this._items.push(item);
        }

        this.resetAccept();

        this._trade.refreshTrade();
    }

    public removeItem(itemId: number): void
    {
        if(this._trade.isLocked) return;

        if(!itemId) return;

        const totalItems = this._items.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.id !== itemId) continue;

            this._user.inventory.items.addItem(item);

            this._items.splice(i, 1);
        }

        this.resetAccept();

        this._trade.refreshTrade();
    }

    public resetItems(): void
    {
        if(this._trade.isLocked) return;
        
        const totalItems = this._items.length;

        if(!totalItems) return;

        this._user.inventory.items.addItem(...this._items);
            
        this._items = [];

        this.resetAccept();

        this._trade.refreshTrade();
    }

    public stopTrading(): void
    {
        return this._trade.stopTrading(this);
    }

    public accept(): void
    {
        this._didAccept = true;

        this._trade.processOutgoing(new RoomTradeAcceptedComposer(this));

        if(this._trade.isAccepted()) this._trade.processOutgoing(new RoomTradeConfirmComposer());
    }

    public resetAccept(): void
    {
        if(this._didAccept) return;
        
        this._didAccept = false;

        this._trade.processOutgoing(new RoomTradeAcceptedComposer(this));
    }

    public confirm(): void
    {
        this._didConfirm = true;

        this._trade.processOutgoing(new RoomTradeAcceptedComposer(this));

        this._trade.finishTrade();
    }
    
    public get trade(): TradeSession
    {
        return this._trade;
    }

    public get user(): User
    {
        return this._user;
    }

    public get items(): Item[]
    {
        return this._items;
    }

    public get didAccept(): boolean
    {
        return this._didAccept;
    }

    public get didConfirm(): boolean
    {
        return this._didConfirm;
    }
}