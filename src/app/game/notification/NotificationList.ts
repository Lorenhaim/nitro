import { NotificationDisplay } from './NotificationDisplay';
import { NotificationItem } from './NotificationItem';
import { NotificationKey } from './NotificationKey';
import { NotificationMessage } from './NotificationMessage';
import { NotificationType } from './NotificationType';

export class NotificationList
{
    private _type: NotificationType;

    private _items: NotificationItem[];

    constructor(type: NotificationType)
    {
        if(!type) throw new Error('invalid_notification');

        this._type = type;

        this._items = [];
    }

    public quickMessage(message: NotificationMessage = null): this
    {
        this.addItem(NotificationKey.DISPLAY, NotificationDisplay.BUBBLE);
        this.addItem(NotificationKey.COUNT, '1');

        if(message) this.addItem(NotificationKey.MESSAGE, message);

        return this;
    }

    public getItem(key: NotificationKey): NotificationItem
    {
        if(!key) return null;

        const totalItems = this._items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.key === key) return item;
        }

        return null;
    }

    public hasItem(key: NotificationKey): boolean
    {
        return this.getItem(key) !== null;
    }

    public addItem(key: NotificationKey, value: string): void
    {
        if(!key || !value) return;

        if(this.hasItem(key)) return;

        this._items.push({ key, value });
    }

    public removeItem(key: NotificationKey): void
    {
        if(!key) return null;

        const totalItems = this._items.length;

        if(!totalItems) return null;

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.key === key)
            {
                this._items.splice(i, 1);

                return;
            }
        }
    }

    public get type(): NotificationType
    {
        return this._type;
    }

    public get items(): NotificationItem[]
    {
        return this._items;
    }
}