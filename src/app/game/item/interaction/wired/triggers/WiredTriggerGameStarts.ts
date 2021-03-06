import { Nitro } from '../../../../../Nitro';
import { IncomingPacket, OutgoingPacket } from '../../../../../packets';
import { User } from '../../../../user';
import { Item } from '../../../Item';
import { WiredTrigger } from './WiredTrigger';
import { WiredTriggerType } from './WiredTriggerType';

export class WiredTriggerGameStarts extends WiredTrigger
{
    constructor()
    {
        super('wf_trg_game_starts', WiredTriggerType.GAME_STARTS);
    }

    public canTrigger(item: Item, ...args: any[]): boolean
    {
        if(!item || !item.wiredData) return false;

        const user = args[0];

        if(!user || !(user instanceof User)) return false;

        if(user.details.username.toLocaleLowerCase().localeCompare(item.wiredData.toLocaleLowerCase()) === -1) return false;

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
            .writeInt(Nitro.config.game.furni.wired.maxItems)
            .writeInt(0)
            .writeInt(item.baseItem.spriteId, item.id)
            .writeString(item.wiredData)
            .writeInt(0, 1, this.triggerType, 0, 0);
    }
}