import { Nitro } from '../../../Nitro';
import { OutgoingPacket } from '../../../packets';
import { Item } from '../Item';
import { ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionGroupFurni extends InteractionDefault implements ParseExtraData
{
    constructor()
    {
        super('group_furni');
    }

    public parseExtraData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        if(item.groupId)
        {
            const group = Nitro.gameManager.groupManager.getActiveGroup(item.groupId);

            if(group) return packet
                .writeInt(2 + (item.limitedData !== '0:0' ? 256 : 0))
                .writeInt(5)
                .writeString(item.extraData)
                .writeString(group.id.toString(), group.badge, group.colorOne.toString(), group.colorTwo.toString());
        }
        
        return packet.writeInt(item.limitedData !== '0:0' ? 256 : 0).writeString(item.extraData);
    }
}