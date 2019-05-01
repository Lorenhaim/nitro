import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { User } from '../../../../user';
import { Item } from '../../../Item';
import { WiredTrigger } from './WiredTrigger';
import { WiredTriggerType } from './WiredTriggerType';

export class WiredTriggerSaysSomething extends WiredTrigger
{
    constructor()
    {
        super('wf_trg_says_something', WiredTriggerType.SAYS_SOMETHING);
    }

    public canTrigger(item: Item, ...args: any[]): boolean
    {
        const user = args[0];

        if(!user || !(user instanceof User)) return;

        const message = args[1];

        if(!message || typeof message !== 'string') return;

        return true;
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        if(!item || !packet) return;
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;
        
        return packet
            .writeBoolean(false)
            .writeInt(5, 0, item.baseItem.spriteId, item.id)
            .writeString('')
            .writeInt(0, 1, this.triggerType, 0, 0);
    }
}