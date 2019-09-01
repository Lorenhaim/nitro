import { shuffleArray } from '../../../../../common';
import { Nitro } from '../../../../../Nitro';
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
        if(!item || !item.room || !item.wiredData) return;

        const user = args[0];

        if(!user || !(user instanceof User)) return;

        const wiredData = item.wiredData.split(':');

        if(wiredData.length !== 2) return;

        const delayNumber = parseInt(wiredData[0]);

        const delay         = delayNumber > 0 && delayNumber <= 20 ? delayNumber * 500 : 0;
        const itemString    = wiredData[1];

        if(!itemString) return;
        
        const parts = itemString.split(',');

        if(!parts) return;

        const totalParts = parts.length;

        if(!totalParts) return;

        shuffleArray(parts);

        const itemId = parseInt(parts[0]);

        if(!itemId) return;

        const activeItem = item.room.itemManager.getItem(itemId);

        if(!activeItem) return;

        super.onTriggered(item, ...args);

        setTimeout(() =>
        {
            if(!activeItem || !activeItem.room) return;

            if(!user || !user.unit || user.unit.room !== activeItem.room) return;

            user.unit.location.effect(UnitEffect.SPARKLES);

            setTimeout(() =>
            {
                user.unit.location.stopWalking();

                user.unit.canLocate = false;
        
                setTimeout(() =>
                {
                    if(!user || !user.unit || !user.unit.location) return;
                    
                    user.unit.location.position.x = activeItem.position.x;
                    user.unit.location.position.y = activeItem.position.y;
    
                    user.unit.location.invokeCurrentItem(true);

                    user.unit.canLocate = true;
                    setTimeout(() => user.unit.location.effect(UnitEffect.NONE), 2000);
                }, 1000);
            }, 1000);
        }, delay);
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        const room = item.room;

        if(!room) return;

        if(!item || !packet) return;

        packet.readInt();
        packet.readString();

        const totalItems                = packet.readInt();
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

        const validatedIds: number[] = [];

        if(item.wiredData)
        {
            const wiredData = item.wiredData.split(':');

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

        packet.writeBoolean(false).writeInt(Nitro.config.game.furni.wired.maxItems)

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