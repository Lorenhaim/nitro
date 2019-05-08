import { Manager } from '../../common';
import { ItemDao } from '../../database';
import { Emulator } from '../../Emulator';
import { ItemFloorAddComposer, ItemFloorRemoveComposer, ItemFloorUpdateComposer, ItemWallAddComposer, ItemWallRemoveComposer, ItemWallUpdateComposer, RoomPaintComposer } from '../../packets';
import { BaseItemType, Interaction } from '../item';
import { Item } from '../item/Item';
import { AffectedPositions, Position } from '../pathfinder';
import { User } from '../user';
import { RoomPaintType } from './interfaces';
import { Room } from './Room';

export class RoomItemManager extends Manager
{
    private _room: Room;

    private _items: Item[];

    constructor(room: Room)
    {
        super('RoomItemManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

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

    public getUserItems(userId: number): Item[]
    {
        if(!userId) return null;

        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.userId === userId) results.push(item);
        }
        
        if(results.length) return results;

        return null;
    }

    public getFloorItems(): Item[]
    {
        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.baseItem.type !== BaseItemType.FLOOR) continue;

            results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public getWallItems(): Item[]
    {
        const totalItems = this._items.length;

        if(!totalItems) return null;

        const results: Item[] = [];

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(!item) continue;

            if(item.baseItem.type !== BaseItemType.WALL) continue;

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

    public placeItem(user: User, itemId: number, position: Position): void
    {
        if(!user || !itemId || !position) return;

        if(!user.unit.hasRights()) return;

        const item = user.inventory.items.getItem(itemId);

        if(!item) return;

        if(this.hasItem(item.id)) return;

        if(item.baseItem.type === BaseItemType.WALL)
        {
            if(typeof position === 'string')
            {
                item.wallPosition = position;

                if(!this._room.getObjectOwnerName(item.userId) && user.details.username) this._room.objectOwners.push({ id: item.userId, username: user.details.username });

                item.setRoom(this._room);

                this._items.push(item);

                user.inventory.items.removeItem(item);

                item.save();

                this._room.unitManager.processOutgoing(new ItemWallAddComposer(item, user.details.username));
            }
        }

        else if(item.baseItem.type === BaseItemType.FLOOR)
        {
            if(!item.isValidPlacement(position, this._room)) return;

            const tile = this._room.map.getTile(position);

            if(!tile) return;

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
            if(!user.unit.hasRights()) return user.connections.processOutgoing(new ItemWallUpdateComposer(item));
            // bubble alert

            if(typeof position === 'string')
            {
                item.wallPosition = position;

                item.save();

                this._room.unitManager.processOutgoing(new ItemWallUpdateComposer(item));
            }
        }

        else if(item.baseItem.type === BaseItemType.FLOOR)
        {
            if(!user.unit.hasRights()) return user.connections.processOutgoing(new ItemFloorUpdateComposer(item));
            // bubble alert

            const oldPosition   = item.position.copy();
            let isRotating      = false;

            if(item.position.direction !== position.direction) isRotating = true;

            if(item.rolling) return;

            if(isRotating)
            {
                if(!item.position.compare(position) || !item.isValidPlacement(position)) return user.connections.processOutgoing(new ItemFloorUpdateComposer(item));
                // bubble alert

                item.position.setDirection(position.direction);
            }
            else
            {
                if(item.position.compareStrict(position) || !item.isValidPlacement(position)) return user.connections.processOutgoing(new ItemFloorUpdateComposer(item));
                // bubble alert

                item.position.x = position.x;
                item.position.y = position.y;
            }

            const tile = item.getTile();

            if(tile && tile.highestItem !== item) item.position.z = tile.tileHeight;

            const affectedPositions = [ ...AffectedPositions.getPositions(item, oldPosition), ...AffectedPositions.getPositions(item) ];

            item.save();
            
            this._room.unitManager.processOutgoing(new ItemFloorUpdateComposer(item));

            if(affectedPositions.length) this._room.map.updatePositions(true, ...affectedPositions);
        }

        const interaction: any = item.baseItem.interaction;

        if(interaction) if(interaction.onMove) interaction.onMove(user, item);
    }

    public removeItem(user: User, ...items: Item[]): void
    {
        if(!user || !user.unit) return;

        const removedItems = [ ...items ];

        const totalRemoved = removedItems.length;

        if(!totalRemoved) return;

        const validatedItems: Item[]        = [];
        const affectedPositions: Position[] = [];

        const totalActiveItems = this._items.length;

        if(!totalActiveItems) return;

        for(let i = 0; i < totalRemoved; i++)
        {
            const item = removedItems[i];

            if(!item) continue;

            if(!user.unit.isOwner() && item.userId !== user.id) continue;

            for(let j = 0; j < totalActiveItems; j++)
            {
                const activeItem = this._items[j];

                if(!activeItem) continue;

                if(activeItem !== item) continue;
                
                if(activeItem.baseItem.type === BaseItemType.WALL)
                {
                    this._items.splice(j, 1);

                    this._room.unitManager.processOutgoing(new ItemWallRemoveComposer(activeItem));

                    if(activeItem.userId === user.id)
                    {
                        validatedItems.push(activeItem);
                    }
                    else
                    {
                        const activeUser = Emulator.gameManager.userManager.getUserById(activeItem.userId);

                        if(activeUser) activeUser.inventory.items.addItem(activeItem);
                        else activeItem.clearRoom();
                    }
                }

                else if(activeItem.baseItem.type === BaseItemType.FLOOR)
                {
                    this._items.splice(j, 1);

                    affectedPositions.push(...AffectedPositions.getPositions(activeItem, activeItem.position));
                    
                    this._room.unitManager.processOutgoing(new ItemFloorRemoveComposer(activeItem));

                    if(activeItem.userId === user.id)
                    {
                        validatedItems.push(item);
                    }
                    else
                    {
                        const activeUser = Emulator.gameManager.userManager.getUserById(activeItem.userId);

                        if(activeUser) activeUser.inventory.items.addItem(activeItem);
                        else activeItem.clearRoom();
                    }
                }

                const interaction: any = item.baseItem.interaction;

                if(interaction) if(interaction.onPickup) interaction.onPickup(user, item);

                break;
            }
        }

        const totalValidated = validatedItems.length;

        if(totalValidated) user.inventory.items.addItem(...validatedItems);

        if(affectedPositions.length) this._room.map.updatePositions(true, ...affectedPositions);
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

        item.clearUser();
    }

    private async loadItems(): Promise<void>
    {
        this._items = [];

        const results = await ItemDao.loadRoomItems(this._room.id);

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

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
}