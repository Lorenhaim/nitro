import { Emulator } from '../../../Emulator';
import { OutgoingPacket } from '../../../packets';
import { Unit } from '../../unit';
import { Item } from '../Item';
import { BeforeStep, OnClick, OnLeave } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionGroupGate extends InteractionDefault implements OnClick, BeforeStep, OnLeave
{
    constructor()
    {
        super('group_gate');
    }

    public beforeStep(unit: Unit, item: Item): void
    {
        item.setExtraData(1);
    }

    public onLeave(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        setTimeout(() => item.setExtraData(0), 500);
    }

    public onClick(unit: Unit, item: Item): void
    {
        return;
    }

    public parseExtraData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        if(item.groupId)
        {
            const group = Emulator.gameManager.groupManager.getActiveGroup(item.groupId);

            if(group) return packet
                .writeInt(2 + (item.limitedData !== '0:0' ? 256 : 0))
                .writeInt(5)
                .writeString(item.extraData)
                .writeString(group.id.toString(), group.badge, group.colorOne.toString(), group.colorTwo.toString());
        }
        
        return packet.writeInt(item.limitedData !== '0:0' ? 256 : 0).writeString(item.extraData);
    }
}