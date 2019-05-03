import { Emulator } from '../../../../../Emulator';
import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { User } from '../../../../user';
import { Item } from '../../../Item';
import { WiredTrigger } from './WiredTrigger';
import { WiredTriggerType } from './WiredTriggerType';

export class WiredTriggerWalkOnFurni extends WiredTrigger
{
    constructor()
    {
        super('wf_trg_walks_on_furni', WiredTriggerType.WALK_ON_FURNI);
    }

    public canTrigger(item: Item, ...args: any[]): boolean
    {
        const user = args[0];

        if(!user || !(user instanceof User)) return false;

        if(!item.wiredData) return true;

        if(user.details.username.localeCompare(item.wiredData) === -1) return false;

        return true;
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        if(!item || !packet) return;

        packet.readInt();
        
        item.setWiredData(packet.readString());
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        return packet
            .writeBoolean(false)
            .writeInt(Emulator.config.game.furni.wired.maxItems) // max items
            .writeInt(0)
            .writeInt(item.baseItem.spriteId, item.id)
            .writeString(item.wiredData)
            .writeInt(0, 1, this.triggerType, 0, 0);
    }
}