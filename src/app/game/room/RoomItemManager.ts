import { Manager } from '../../common';
import { ItemDao } from '../../database';
import { Emulator } from '../../Emulator';
import { GenericNotificationListComposer, ItemFloorAddComposer, ItemFloorRemoveComposer, ItemFloorUpdateComposer, ItemWallAddComposer, ItemWallRemoveComposer, ItemWallUpdateComposer, RoomPaintComposer } from '../../packets';
import { BaseItemType, Interaction, InteractionDimmer } from '../item';
import { Item } from '../item/Item';
import { NotificationList, NotificationMessage, NotificationType } from '../notification';
import { AffectedPositions, Position } from '../pathfinder';
import { User } from '../user';
import { RoomPaintType } from './interfaces';
import { Room } from './Room';

export class RoomItemManager extends Manager
{
    private _room: Room;

    private _items: Item[];
    private _dimmer: Item;

    constructor(room: Room)
    {
        super('RoomItemManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room      = room;

        this._items     = [];
        this._dimmer    = null;
    }

    protected async onInit(): Promise<void>
    {
        await this.loadItems();
    }
    
    protected async onDispose(): Promise<void>
    {
        this._items     = [];
        this._dimmer    = null;
    }

    public getItem(id: number): Item
    {
        if(!id) return null;
        
        const totalItems = this._items.length;

        if(!totalItems) return null;
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.id === id) return item;
        }

        return null;
    }

    public getItemsByUser(user: User): Item[]
    {
        if(!user) return null;
        
        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.userId === user.id) results.push(item);
        }
        
        if(results.length) return results;

        return null;
    }

    public getItemsByType(type: BaseItemType): Item[]
    {
        if(!type) return null;

        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.baseItem.type !== type) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public getItemsByString(items: string): Item[]
    {
        if(!items) return null;

        const parts = items.split(',');

        if(!parts) return null;

        const totalParts = parts.length;

        if(!totalParts) return null;

        const results: Item[] = [];

        for(let i = 0; i < totalParts; i++)
        {
            const part = parseInt(parts[i]);

            if(!part) continue;

            const item = this.getItem(part);

            if(!item) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public getItemsByInteraction(interaction: typeof Interaction): Item[]
    {
        if(!interaction) return null;

        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(!(item.baseItem.interaction instanceof interaction)) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public hasItem(id: number): boolean
    {
        return this.getItem(id) !== null;
    }

    public setDimmer(): void
    {
        this._dimmer = null;

        const wallItems = this.getItemsByType(BaseItemType.WALL);

        if(!wallItems) return;

        const totalItems = wallItems.length;

        if(!totalItems) return;

        for(let i = 0; i < totalItems; i++)
        {
            const item = wallItems[i];

            if(!item) continue;

            if(!item.baseItem.hasInteraction(InteractionDimmer)) continue;

            this._dimmer = item;

            return;
        }
    }

    public placeItem(user: User, itemId: number, position: Position): void
    {
        if(!this._room.details.allowEditing) return;

        if(!user || !itemId || !position) return;

        if(!user.unit.hasRights()) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_RIGHTS)));

        const item = user.inventory.items.getItem(itemId);

        if(!item) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_ITEM)));

        if(this.hasItem(item.id)) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.ITEM_EXISTS)));

        if(item.baseItem.type === BaseItemType.WALL)
        {
            if(item.baseItem.hasInteraction(InteractionDimmer))
            {
                if(this._dimmer) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.MAX_DIMMERS)));
            }

            if(typeof position === 'string')
            {
                item.wallPosition = position;

                if(!this._room.getObjectOwnerName(item.userId) && user.details.username) this._room.objectOwners.push({ id: item.userId, username: user.details.username });

                item.setRoom(this._room);

                this._items.push(item);

                this.setDimmer();

                user.inventory.items.removeItem(item);

                item.save();

                this._room.unitManager.processOutgoing(new ItemWallAddComposer(item, user.details.username));
            }
            else return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_PLACEMENT)));
        }

        else if(item.baseItem.type === BaseItemType.FLOOR)
        {
            if(!item.isValidPlacement(position, this._room)) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_PLACEMENT)));

            const tile = this._room.map.getTile(position);

            if(!tile) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_PLACEMENT)));

            item.position   = position.copy();
            item.position.z = tile.tileHeight;

            if(!this._room.getObjectOwnerName(item.userId) && user.details.username) this._room.objectOwners.push({ id: item.userId, username: user.details.username });

            item.setRoom(this._room);

            this._items.push(item);

            user.inventory.items.removeItem(item);

            item.save();

            const affectedPositions = [ ...AffectedPositions.getPositions(item) ];

            if(affectedPositions.length) this._room.map.updatePositions(true, ...affectedPositions);

            this._room.unitManager.processOutgoing(new ItemFloorAddComposer(item, user.details.username));
        }
    }

    public moveItem(user: User, item: Item, position: Position): void
    {
        if(!user || !item || !position) return;

        if(item.baseItem.type === BaseItemType.WALL)
        {
            if(!this._room.details.allowEditing)
            {
                user.connections.processOutgoing(new ItemWallUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_EDITING)));
            }

            if(!user.unit.hasRights())
            {
                user.connections.processOutgoing(new ItemWallUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_RIGHTS)));
            }

            if(typeof position === 'string')
            {
                item.wallPosition = position;

                item.save();

                this._room.unitManager.processOutgoing(new ItemWallUpdateComposer(item));
            }
            else
            {
                user.connections.processOutgoing(new ItemWallUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_PLACEMENT)));
            }
        }

        else if(item.baseItem.type === BaseItemType.FLOOR)
        {
            if(!this._room.details.allowEditing)
            {
                user.connections.processOutgoing(new ItemFloorUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_EDITING)));
            }

            item.rolling = null;

            if(!user.unit.hasRights())
            {
                user.connections.processOutgoing(new ItemFloorUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_RIGHTS)));
            }

            if(!item.isValidPlacement(position))
            {
                user.connections.processOutgoing(new ItemFloorUpdateComposer(item));

                return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.INVALID_PLACEMENT)));
            }

            const oldPosition = item.position.copy();
            
            item.position.setDirection(position.direction);
            
            item.position.x = position.x;
            item.position.y = position.y;

            const tile = item.getTile();

            if(tile && tile.highestItem !== item) item.position.z = tile.tileHeight;

            const affectedPositions = [ ...AffectedPositions.getPositions(item, oldPosition), ...AffectedPositions.getPositions(item) ];

            item.save();
            
            this._room.unitManager.processOutgoing(new ItemFloorUpdateComposer(item));

            if(affectedPositions.length) this._room.map.updatePositions(true, ...affectedPositions);
        }

        const interaction: any = item.baseItem.interaction;

        if(interaction && interaction.onMove) interaction.onMove(user, item);
    }

    public removeItem(user: User, ...items: Item[]): void
    {
        if(!this._room.details.allowEditing) return user.connections.processOutgoing(new GenericNotificationListComposer(new NotificationList(NotificationType.FURNI_PLACEMENT_ERROR).quickMessage(NotificationMessage.NO_EDITING)));

        if(!user || !user.unit) return;

        const removedItems = [ ...items ];

        const totalRemoved = removedItems.length;

        if(!totalRemoved) return;

        const validatedItems: Item[]        = [];
        const affectedPositions: Position[] = [];

        if(!this._items.length) return;

        for(let i = 0; i < totalRemoved; i++)
        {
            const item = removedItems[i];

            if(!item) continue;

            if(!user.unit.isOwner() && !user.unit.isGroupAdmin() && item.userId !== user.id) continue;

            const totalActiveItems = this._items.length;

            for(let j = 0; j < totalActiveItems; j++)
            {
                const activeItem = this._items[j];

                if(!activeItem) continue;

                if(activeItem !== item) continue;
                
                if(activeItem.baseItem.type === BaseItemType.WALL)
                {
                    this._items.splice(j, 1);

                    this._room.unitManager.processOutgoing(new ItemWallRemoveComposer(activeItem));

                    if(!item.willRemove && activeItem.userId === user.id)
                    {
                        validatedItems.push(activeItem);
                    }
                    else
                    {
                        const activeUser = Emulator.gameManager.userManager.getUserById(activeItem.userId);

                        if(!item.willRemove && activeUser) activeUser.inventory.items.addItem(activeItem);
                        else activeItem.clearRoom();
                    }

                    this.setDimmer();
                }

                else if(activeItem.baseItem.type === BaseItemType.FLOOR)
                {
                    this._items.splice(j, 1);

                    affectedPositions.push(...AffectedPositions.getPositions(activeItem, activeItem.position));
                    
                    this._room.unitManager.processOutgoing(new ItemFloorRemoveComposer(activeItem));

                    if(!item.willRemove && activeItem.userId === user.id)
                    {
                        validatedItems.push(item);
                    }
                    else
                    {
                        const activeUser = Emulator.gameManager.userManager.getUserById(activeItem.userId);

                        if(!item.willRemove && activeUser) activeUser.inventory.items.addItem(activeItem);
                        else activeItem.clearRoom();
                    }
                }

                const interaction: any = item.baseItem.interaction;

                if(interaction && interaction.onPickup) interaction.onPickup(user, item);

                break;
            }

            item.save();
        }

        const totalValidated = validatedItems.length;

        if(totalValidated) user.inventory.items.addItem(...validatedItems);

        if(affectedPositions.length) this._room.map.updatePositions(true, ...affectedPositions);
    }

    public removeAllItems(user: User): void
    {
        if(!user || !user.unit) return;

        const totalItems = this._items.length;

        if(!totalItems) return;

        const validatedItems: Item[] = [];

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(!user.unit.isOwner() && item.userId !== user.id) continue;

            if(item.userId === user.id)
            {
                validatedItems.push(item);
            }
            else
            {
                const activeUser = Emulator.gameManager.userManager.getUserById(item.userId);

                if(activeUser) activeUser.inventory.items.addItem(item);
                else item.clearRoom();
            }
            
            const interaction: any = item.baseItem.interaction;

            if(interaction && interaction.onPickup) interaction.onPickup(user, item);
        }

        if(validatedItems.length) user.inventory.items.addItem(...validatedItems);
    }

    public paintRoom(user: User, itemId: number): void
    {
        if(!user || !itemId) return;

        const item = user.inventory.items.getItem(itemId);

        if(!item || !item.extraData) return;

        if(item.baseItem.productName === 'floor')
        {
            this._room.details.setFloorPaint(parseInt(item.extraData));

            this._room.unitManager.processOutgoing(new RoomPaintComposer(this._room, RoomPaintType.FLOOR));
        }

        else if(item.baseItem.productName === 'wallpaper')
        {
            this.room.details.setWallPaint(parseInt(item.extraData));

            this.room.unitManager.processOutgoing(new RoomPaintComposer(this._room, RoomPaintType.WALLPAPER));
        }

        else if(item.baseItem.productName === 'landscape')
        {
            this.room.details.setLandscapePaint(item.extraData);

            this.room.unitManager.processOutgoing(new RoomPaintComposer(this._room, RoomPaintType.LANDSCAPE));
        }

        user.inventory.items.removeItem(item);

        item.willRemove = true;

        item.save();
    }

    private async loadItems(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._items = [];

        const results = await ItemDao.loadRoomItems(this._room.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            if(!this._room.getObjectOwnerName(result.userId))
            {
                const username = await ItemDao.getOwnerUsername(result.id);

                this._room.objectOwners.push({ id: result.userId, username });
            }

            const item = new Item(result);

            item.setRoom(this._room);

            this._items.push(item);
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get items(): Item[]
    {
        return this._items;
    }

    public get dimmer(): Item
    {
        return this._dimmer;
    }
}