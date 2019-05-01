import { ItemEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { ItemExtraDataComposer, ItemStateComposer, OutgoingPacket } from '../../packets';
import { AffectedPositions, Direction, Position } from '../pathfinder';
import { Room, RoomTile, RoomTileState } from '../room';
import { User } from '../user';
import { BaseItem, BaseItemType } from './base';
import { InteractionType } from './interaction';
import { ItemRolling } from './ItemRolling';

export class Item
{
    private _entity: ItemEntity;

    private _room: Room;

    private _baseItem: BaseItem;
    private _itemBelow: Item;
    
    private _position: Position;
    private _rolling: ItemRolling;

    private _didCancelState: boolean;

    constructor(entity: ItemEntity)
    {
        if(!(entity instanceof ItemEntity)) throw new Error('invalid_entity');

        this._entity            = entity;

        this._room              = null;

        this._baseItem          = null;
        this._itemBelow         = null;

        this._position          = null;
        this._rolling           = null;

        this._didCancelState    = false;

        if(entity.roomId) this._position = new Position(this._entity.x, this._entity.y, parseFloat(this._entity.z), parseInt(<any> this._entity.direction));

        if(entity.baseId)
        {
            const baseItem = Emulator.gameManager.itemManager.getBaseItem(this._entity.baseId);

            if(baseItem) this._baseItem = baseItem;
            else throw new Error('invalid_base_id');
        }
        else
        {
            throw new Error('invalid_base');
        }
    }

    public save(): void
    {
        if(this._baseItem.type === BaseItemType.FLOOR)
        {
            if(this._entity.roomId)
            {
                this._entity.x          = this._position.x || 0;
                this._entity.y          = this._position.y || 0;
                this._entity.z          = this._position.z.toString() || '0.00';
                this._entity.direction  = this._position.direction || 0;
            }
        }
        
        Emulator.gameScheduler.saveItem(this._entity);
    }

    public getTile(): RoomTile
    {
        if(this._room) return this._room.map.getTile(this._position);

        return null;
    }

    public canPlaceOnTop(item: Item, isRolling: boolean = false): boolean
    {
        if(!item) return false;
        
        if(item.baseItem.canStack && !item.baseItem.canSit && !item.baseItem.canLay)
        {
            if(item.baseItem.hasInteraction(InteractionType.ROLLER))
            {
                if(this._baseItem.width > 1 || this._baseItem.length > 1) return false;
            }

            if(this._baseItem.hasInteraction(InteractionType.ROLLER))
            {
                if(item.baseItem.hasInteraction(InteractionType.ROLLER)) return false;

                if(item.baseItem.stackHeight > 0.01) return false;
            }

            return true;
        }

        return false;
    }

    public isValidPlacement(position: Position, room: Room = null): boolean
    {
        if(position)
        {
            if(!room && this._room) room = this._room;

            const isRotating = this._position && this._position.direction !== position.direction;

            const goalTile = room.map.getTile(position);

            if(goalTile)
            {
                const goalHeight = goalTile.tileHeight;

                const affectedPositions = AffectedPositions.getPositions(this, position);

                if(affectedPositions)
                {
                    const totalPositions = affectedPositions.length;

                    if(totalPositions)
                    {
                        for(let i = 0; i < totalPositions; i++)
                        {
                            const tile = room.map.getTile(affectedPositions[i]);

                            if(!tile) return false;

                            if(tile.state === RoomTileState.CLOSED) return false;

                            if(tile.isDoor) return false;

                            //if(tile.tileHeight !== goalHeight) return false;

                            if(tile.units.length > 0 && !this._baseItem.canWalk) return false;

                            const highestItem = tile.highestItem;

                            if(isRotating && highestItem === this) return true;

                            if(highestItem && highestItem.id !== this._entity.id && !this.canPlaceOnTop(highestItem)) return false;

                            const items = tile.items;

                            if(items)
                            {
                                const totalItems = items.length;

                                if(totalItems)
                                {
                                    for(let j = 0; j < totalItems; j++)
                                    {
                                        const item = items[j];

                                        if(item.id === this._entity.id) continue;

                                        if(!this.canPlaceOnTop(item)) return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return true;
        }

        return false;
    }

    public setWiredData(wiredData: string)
    {
        this._entity.wiredData = wiredData.toString();

        this.save();
    }

    public setExtraData(extraData: string | number, send: boolean = true)
    {
        this._entity.extraData = extraData.toString();

        this.save();

        if(this._room && send)
        {
            if(this.isLimited) this._room.unitManager.processOutgoing(new ItemExtraDataComposer(this));
            else this._room.unitManager.processOutgoing(new ItemStateComposer(this));
        }
    }

    public setUser(user: User): void
    {
        if(user)
        {
            if(this._entity.userId !== user.id)
            {
                this._entity.userId = user.id;

                this.save();
            }
        }
    }

    public setRoom(room: Room): void
    {
        if(room)
        {
            if(this._entity.roomId !== room.id)
            {
                this._entity.roomId = room.id;

                this.save();
            }

            this._room = room;
        }
    }

    public clearRoom(): void
    {
        this._entity.roomId = null;
        this._room          = null;

        this.save();
    }

    public clearUser(): void
    {
        this._entity.userId = null;

        this.save();
    }

    public parseFloorData(packet: OutgoingPacket): OutgoingPacket
    {
        if(packet)
        {
            return packet
                .writeInt(this._entity.id)
                .writeInt(this._baseItem.spriteId)
                .writeShort(0)
                .writeShort(this._position.x)
                .writeShort(0)
                .writeShort(this._position.y)
                .writeInt(this._position.direction)
                .writeString(this._position.z.toFixed(2))
                .writeString(this._baseItem.canWalk || this._baseItem.canSit ? this._baseItem.stackHeight.toFixed(2) : null);
        }

        return null;
    }

    public parseWallData(packet: OutgoingPacket): OutgoingPacket
    {
        if(packet)
        {
            return packet
                .writeString(this._entity.id.toString())
                .writeInt(this._baseItem.spriteId)
                .writeString(this._entity.wallPosition)
                .writeString(this._entity.extraData)
                .writeInt(-1, this._baseItem.canToggle ? 1 : 0, this._entity.userId);
        }

        return null;
    }

    public parseInventoryData(packet: OutgoingPacket): OutgoingPacket
    {
        if(packet)
        {
            packet
                .writeInt(this._entity.id)
                .writeString(this._baseItem.type)
                .writeInt(this._entity.id)
                .writeInt(this._baseItem.spriteId);

            if(this._baseItem.productName === 'floor') packet.writeInt(3).writeInt(0).writeString(this._entity.extraData);
            else if(this._baseItem.productName === 'landscape') packet.writeInt(4).writeInt(0).writeString(this._entity.extraData);
            else if(this._baseItem.productName === 'wallpaper') packet.writeInt(2).writeInt(0).writeString(this._entity.extraData);
            else if(this._baseItem.productName === 'poster') packet.writeInt(6).writeInt(0).writeString(this._entity.extraData);
            else
            {
                packet.writeInt(1);
                this.parseExtraData(packet);
            }

            packet
                .writeBoolean(this._baseItem.canRecycle, this._baseItem.canTrade, this._entity.limitedData !== '0:0' ? false : this._baseItem.canInventoryStack, this._baseItem.canSell)
                .writeInt(-1)
                .writeBoolean(true)
                .writeInt(-1);
            
            if(this._baseItem.type === BaseItemType.FLOOR)
            {
                packet.writeString(null).writeInt(1);
            }

            return packet;
        }
    }

    public parseExtraData(packet: OutgoingPacket): OutgoingPacket
    {
        if(packet)
        {
            const interaction: any = this._baseItem.interaction;

            if(interaction && interaction.parseExtraData) interaction.parseExtraData(this, packet);
            else packet.writeInt(0).writeString('0');

            if(this._entity.limitedData !== '0:0')
            {
                const parts = this._entity.limitedData.split(':');

                if(parts.length === 2)
                {
                    packet.writeInt(parseInt(parts[0]), parseInt(parts[1]));
                }
            }
            
            return packet;
        }

        return null;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get room(): Room
    {
        return this._room;
    }

    public set room(room: Room)
    {
        this._room = room;
    }

    public get roomId(): number
    {
        return this._entity.roomId;
    }

    public set roomId(id: number)
    {
        this._entity.roomId = id;
    }

    public get baseItem(): BaseItem
    {
        return this._baseItem;
    }

    public get itemBelow(): Item
    {
        return this._itemBelow;
    }

    public set itemBelow(item: Item)
    {
        this._itemBelow = item;
    }

    public get position(): Position
    {
        return this._position;
    }

    public set position(position: Position)
    {
        this._position = position;
    }

    public get rolling(): ItemRolling
    {
        return this._rolling;
    }

    public set rolling(rolling: ItemRolling)
    {
        this._rolling = rolling;
    }

    public get height(): number
    {
        return this._position.z + this._baseItem.currentStackHeight(this._entity.extraData);
    }

    public get direction(): Direction
    {
        return this._entity.direction;
    }

    public set direction(direction: Direction)
    {
        this._entity.direction = direction;
    }

    public get wallPosition(): string
    {
        return this._entity.wallPosition;
    }

    public set wallPosition(position: string)
    {
        this._entity.wallPosition = position;
    }

    public get isLimited(): boolean
    {
        return this._entity.limitedData !== '0:0';
    }

    public get limitedData(): string
    {
        return this._entity.limitedData;
    }

    public set limitedData(limited: string)
    {
        this._entity.limitedData = limited;
    }

    public get wiredData(): string
    {
        return this._entity.wiredData || '0';
    }

    public get extraData(): string
    {
        return this._entity.extraData || '0';
    }

    public get isItemOpen(): boolean
    {
        if(this._baseItem.hasInteraction(InteractionType.GATE, InteractionType.TELEPORT))
        {
            if(this._entity.extraData === '1') return true;
        }

        return this._baseItem.canWalk;
    }

    public get isItemClosed(): boolean
    {
        return this._baseItem.hasInteraction(InteractionType.DICE, InteractionType.GATE, InteractionType.TELEPORT) && this._entity.extraData === '0';
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }
}