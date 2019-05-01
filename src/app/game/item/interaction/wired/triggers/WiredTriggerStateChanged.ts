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
        return true;
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        if(!item || !packet) return;
        
        console.log('save it');
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        return packet
            .writeBoolean(false)
            .writeInt(5) // max furni
            .writeInt(0) // items, iterate ids
            .writeInt(item.baseItem.spriteId)
            .writeInt(item.id)
            .writeString('')
            .writeInt(0, 0)
            .writeInt(this.triggerType)
            .writeInt(0);
    }
}