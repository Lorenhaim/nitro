import { Emulator } from '../../../../../Emulator';
import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { Item } from '../../../Item';
import { WiredTrigger } from './WiredTrigger';
import { WiredTriggerType } from './WiredTriggerType';

export class WiredTriggerStateChanged extends WiredTrigger
{
    constructor()
    {
        super('wf_trg_state_changed', WiredTriggerType.STATE_CHANGED);
    }

    public canTrigger(item: Item, ...args: any[]): boolean
    {
        if(!item) return false;

        const clickedItem = args[0];

        if(!clickedItem || !(clickedItem instanceof Item)) return false;

        let itemString  = item.wiredData;

        if(!itemString) return false;

        const parts = itemString.split(',');
        
        if(!parts) return false;

        if(parts.indexOf(item.id.toString()) === -1) return false;

        return true;
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        if(!item || !packet) return;
        
        const room = item.room;

        if(!room) return;

        packet.readInt();
        packet.readString();

        const totalItems = packet.readInt();

        const validatedIds: number[] = [];

        if(!totalItems) return;
        
        for(let i = 0; i < totalItems; i++)
        {
            const itemId = packet.readInt();

            if(!itemId) continue;

            const item = room.itemManager.getItem(itemId);

            if(!item) continue;

            validatedIds.push(item.id);
        }

        item.setWiredData(validatedIds.join(','));
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        const room = item.room;

        if(!room) return;

        const validatedIds: number[] = [];

        let itemString  = item.wiredData;

        if(itemString)
        {
            const items = room.itemManager.getItemsByString(itemString);

            if(items)
            {
                const totalItems = items.length;

                if(totalItems) for(let i = 0; i < totalItems; i++) validatedIds.push(items[i].id);
            }
        }

        packet.writeBoolean(false).writeInt(Emulator.config.game.furni.wired.maxItems);

        const totalItems = validatedIds.length;

        if(totalItems)
        {
            packet.writeInt(totalItems);

            for(let i = 0; i < totalItems; i++) packet.writeInt(validatedIds[i]);
        }
        else packet.writeInt(0);

        return packet
            .writeInt(item.baseItem.spriteId)
            .writeInt(item.id)
            .writeString('')
            .writeInt(0, 0)
            .writeInt(this.triggerType)
            .writeInt(0);
    }
}