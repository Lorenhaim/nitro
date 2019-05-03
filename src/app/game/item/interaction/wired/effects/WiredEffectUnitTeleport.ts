import { shuffleArray } from '../../../../../common';
import { Emulator } from '../../../../../Emulator';
import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { UnitEffect } from '../../../../unit';
import { User } from '../../../../user';
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
        const room = item.room;
        
        if(!room) return;

        let user = args[0];

        if(user)
        {
            if(!(user instanceof User))
            {
                user = args[1];

                if(!user || !(user instanceof User)) return;
            }
        }

        const wiredData = item.wiredData.split(':');

        if(wiredData.length > 2) return;

        let delay               = 0;
        let itemString: string  = null;

        if(wiredData.length === 1)
        {
            itemString = wiredData[0];
        }

        else if(wiredData.length === 2)
        {
            const number = parseInt(wiredData[0]);

            delay       = number > 0 ? parseInt(wiredData[0]) * 500 : 0;
            itemString  = wiredData[1];
        }

        if(!itemString) return;
        
        const parts = itemString.split(',');

        if(!parts) return;

        const totalParts = parts.length;

        if(!totalParts) return;

        shuffleArray(parts);

        const itemId = parseInt(parts[0]);

        if(!itemId) return;

        setTimeout(() =>
        {
            super.onTriggered(item, ...args);
            
            const activeItem = room.itemManager.getItem(itemId);

            if(!activeItem) return;
    
            user.unit.location.effect(UnitEffect.SPARKLES);
    
            user.unit.location.position.x = activeItem.position.x;
            user.unit.location.position.y = activeItem.position.y;
    
            user.unit.needsInvoke = true;
            user.unit.needsUpdate = true;
    
            setTimeout(() => user.unit.location.effect(UnitEffect.NONE), 1000);
        }, delay);
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        const room = item.room;

        if(!room) return;

        if(!item || !packet) return;

        packet.readInt();
        packet.readString();

        const totalItems = packet.readInt();

        const ids: number[]             = [];
        const validatedIds: number[]    = [];

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++) ids.push(packet.readInt());

            const totalIds = ids.length;

            if(totalIds)
            {
                const itemString = ids.join(',');

                const items = room.itemManager.getItemsByString(itemString);

                if(items)
                {
                    const totalItems = items.length;

                    if(totalItems) for(let i = 0; i < totalIds; i++) validatedIds.push(items[i].id);
                }
            }
        }

        item.setWiredData(`${ packet.readInt() }:${ validatedIds.join(',') }`);
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return;

        const room = item.room;

        if(!room) return;

        let delay       = 0;
        let itemString  = null;

        const wiredData                 = item.wiredData.split(':');
        const validatedIds: number[]    = [];

        if(wiredData.length === 2)
        {
            delay       = parseInt(wiredData[0]);
            itemString  = wiredData[1];

            if(itemString)
            {
                const items = room.itemManager.getItemsByString(itemString);

                if(items)
                {
                    const totalItems = items.length;

                    if(totalItems) for(let i = 0; i < totalItems; i++) validatedIds.push(items[i].id);
                }
            }
        }

        packet.writeBoolean(false).writeInt(Emulator.config.game.furni.wired.maxItems)

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
            .writeInt(0, 0, this.triggerType, delay, 0);
    }
}