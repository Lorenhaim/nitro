import { Manager } from '../../../../common';
import { ItemDao } from '../../../../database';
import { UserItemAddComposer, UserItemRemoveComposer, UserItemsRefreshComposer } from '../../../../packets';
import { Item } from '../../../item';
import { User } from '../../User';

export class UserItems extends Manager
{
    private _user: User;
    private _items: Item[];

    constructor(user: User)
    {
        super('UserItems', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user  = user;
        this._items = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadItems();
    }

    protected async onDispose(): Promise<void>
    {
        this._items = [];
    }

    public getItem(id: number): Item
    {
        const totalItems = this._items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(item.id === id) return item;
        }

        return null;
    }

    public hasItem(id: number): boolean
    {
        return this.getItem(id) !== null;
    }

    public addItem(...items: Item[]): void
    {
        const addedItems                = [ ...items ];
        const validatedItems: Item[]    = [];

        if(!addedItems) return;
        
        const totalItems = addedItems.length;

        if(!totalItems) return;
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = addedItems[i];

            if(!item) continue;

            if(item.willRemove) continue;

            if(this.hasItem(item.id)) continue;

            validatedItems.push(item);
        }

        const totalValidatedItems = validatedItems.length;

        if(!totalValidatedItems) return;

        for(let i = 0; i < totalValidatedItems; i++)
        {
            const item = validatedItems[i];

            item.setUser(this._user);
            item.clearRoom();
        }
        
        this._items.push(...validatedItems);

        this._user.connections.processOutgoing(new UserItemAddComposer(...validatedItems), new UserItemsRefreshComposer());
    }

    public removeItem(...items: Item[]): void
    {
        const removedItems = [ ...items ];

        if(!removedItems) return;
        
        const totalItems = removedItems.length;
        const totalActiveItems = this._items.length;

        if(!totalItems || !totalActiveItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = removedItems[i];

            for(let j = 0; j < totalActiveItems; j++)
            {
                const activeItem = this._items[j];

                if(!activeItem) continue;

                if(activeItem !== item) continue;

                this._user.connections.processOutgoing(new UserItemRemoveComposer(activeItem.id));

                this._items.splice(j, 1);

                break;
            }
        }
    }

    private async loadItems(): Promise<void>
    {
        this._items = [];

        const results = await ItemDao.loadUserItems(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;

        for(let i = 0; i < totalResults; i++) this._items.push(new Item(results[i]));
    }

    public get user(): User
    {
        return this._user;
    }

    public get items(): Item[]
    {
        return this._items;
    }
}