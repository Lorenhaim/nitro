import { Nitro } from '../../Nitro';
import { ItemFloorRemoveComposer, ItemWallRemoveComposer, Outgoing } from '../../packets';
import { BaseItemType, Item } from '../item';
import { AffectedPositions, Position } from '../pathfinder';
import { RoomTile } from '../room';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class PickupAllCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'pa', 'pickall');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const room = user.unit.room;

        if(room)
        {
            const pendingOutgoing: Outgoing[] = [];

            if(user.unit.isOwner())
            {
                const items = room.itemManager.items;

                const itemsRemoved: Item[]          = [];
                const affectedPositions: Position[] = [];
                const affectedTiles: RoomTile[]     = [];

                if(items)
                {
                    while(items.length)
                    {
                        const item = items.shift();

                        if(item)
                        {
                            if(item.userId === user.id)
                            {
                                itemsRemoved.push(item);
                            }
                            else
                            {
                                const activeUser = Nitro.gameManager.userManager.getUserById(item.userId);

                                if(activeUser) activeUser.inventory.items.addItem(item);
                            }

                            if(item.baseItem.type === BaseItemType.FLOOR)
                            {
                                affectedPositions.push(...AffectedPositions.getPositions(item, item.position));

                                pendingOutgoing.push(new ItemFloorRemoveComposer(item));
                            }

                            else if(item.baseItem.type === BaseItemType.WALL) pendingOutgoing.push(new ItemWallRemoveComposer(item));

                            const interaction: any = item.baseItem.interaction;

                            if(interaction) if(interaction.onPickup) interaction.onPickup(user, item);
                        }
                    }
                }

                if(affectedPositions.length) room.map.updatePositions(true, ...affectedPositions);
                
                if(itemsRemoved.length) user.inventory.items.addItem(...itemsRemoved);
            }

            if(pendingOutgoing.length) room.unitManager.processOutgoing(...pendingOutgoing);
        }
    }

    public get description(): string
    {
        return 'Pickups all items in the room';
    }
}