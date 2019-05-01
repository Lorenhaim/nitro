import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { Item } from '../../../Item';
import { OnTriggered, ParseWiredData } from '../../actions';
import { WiredEffect } from './WiredEffect';
import { WiredEffectType } from './WiredEffectType';

export class WiredEffectUnitTeleport extends WiredEffect implements ParseWiredData, OnTriggered
{
    constructor()
    {
        super('wf_act_teleport_to', WiredEffectType.UNIT_TELEPORT);
    }

    public onTriggered(item: Item, ...args: any[]): void
    {
        super.onTriggered(item, ...args);

        const room = item.room;
        
        if(!room) return;

        // const chair = room.itemManager.getRandomChair();

        // if(!chair) return;

        // unit.location.effect(UnitEffect.SPARKLES);

        // unit.location.position.x = chair.position.x;
        // unit.location.position.y = chair.position.y;

        // unit.needsInvoke = true;
        // unit.needsUpdate = true;

        // setTimeout(() => unit.location.effect(UnitEffect.NONE), 1000);
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        const room = item.room;

        if(!room) return;

        if(!item || !packet) return;

        packet.readInt();
        packet.readString();

        const totalItems = packet.readInt();

        const validatedIds: number[] = [];

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const itemId = packet.readInt();

                if(!itemId) continue;

                const item = room.itemManager.getItem(itemId);

                if(!item) continue;

                validatedIds.push(item.id);
            }
        }

        const delayMs = packet.readInt() / 2;

        item.setWiredData(`${ delayMs }:${ validatedIds.join(',') }`);
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return;

        const room = item.room;

        if(!room) return;

        const validatedIds: number[] = [];

        const wiredData = item.wiredData.split(':');

        if(wiredData.length > 2) return;

        let delay       = 0;
        let itemString  = null;

        if(wiredData.length === 1)
        {
            itemString = wiredData[0];
        }

        else if(wiredData.length === 2)
        {
            delay       = parseInt(wiredData[0]);
            itemString  = wiredData[1];
        }

        if(itemString)
        {
            const parts = itemString.split(',');

            const totalParts = parts.length;

            if(totalParts)
            {
                for(let i = 0; i < totalParts; i++)
                {
                    const itemId = parseInt(parts[i]);

                    if(!itemId) continue;

                    const item = room.itemManager.getItem(itemId);

                    if(!item) continue;

                    validatedIds.push(item.id);
                }
            }
        }

        console.log(validatedIds);

        packet
            .writeBoolean(false)
            .writeInt(5) // max furni

        const totalItems = validatedIds.length;

        if(totalItems)
        {
            packet.writeInt(totalItems);

            for(let i = 0; i < totalItems; i++) packet.writeInt(validatedIds[i]);
        }
        else packet.writeInt(0);
            
        return packet
            .writeInt(item.baseItem.spriteId, item.id)
            .writeString('')
            .writeInt(0, 0, this.triggerType, delay * 2, 0);
    }
}