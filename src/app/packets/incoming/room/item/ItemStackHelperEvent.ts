import { AffectedPositions, InteractionStackHelper } from '../../../../game';
import { ItemFloorUpdateComposer, ItemStackHelperComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class ItemStackHelperEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;
            
            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            if(item.baseItem.hasInteraction(InteractionStackHelper))
            {
                const stackHeight = this.packet.readInt() / 100;

                const positions = AffectedPositions.getPositions(item);

                if(!positions) return;

                const totalPositions = positions.length;

                if(!totalPositions) return;

                for(let i = 0; i < totalPositions; i++)
                {
                    const position = positions[i];

                    if(!position) continue;

                    const tile = currentRoom.map.getTile(position);

                    if(!tile) continue;

                    const items = tile.items;

                    if(!items) continue;

                    const totalItems = items.length;

                    if(!totalItems) continue;

                    for(let j = 0; j < totalItems; j++)
                    {
                        const item = items[i];

                        if(!item) continue;

                        item.position.z = stackHeight;

                        currentRoom.unitManager.processOutgoing(new ItemFloorUpdateComposer(item));

                        currentRoom.map.updatePositions(true, item.position);

                        item.save();
                    }
                }

                currentRoom.unitManager.processOutgoing(new ItemStackHelperComposer(item, stackHeight));
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}