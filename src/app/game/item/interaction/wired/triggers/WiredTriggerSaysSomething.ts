import { Nitro } from '../../../../../Nitro';
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

        if(!user || !(user instanceof User)) return false;

        const chat = args[1];

        if(!chat || typeof chat !== 'string') return false;

        const wiredData = item.wiredData.split(':');

        if(wiredData.length > 2) return false;

        let ownerOnly   = 0;
        let message     = null;

        if(wiredData.length === 2)
        {
            ownerOnly   = wiredData[0] === '1' ? 1 : 0;
            message     = wiredData[1];
        }

        if(!message) return true;

        if(chat.indexOf(message) === -1) return false;

        if(ownerOnly === 1)
        {
            const room = item.room;

            if(!room) return false;

            if(!room.securityManager.isOwner(user)) return false;
        }

        return true;
    }

    public saveWiredData(item: Item, packet: IncomingPacket): void
    {
        if(!item || !packet) return;

        packet.readInt();

        const ownerOnly = packet.readInt() === 1;

        item.setWiredData(`${ ownerOnly ? 1 : 0 }:${ packet.readString() }`)
    }

    public parseWiredData(item: Item, packet: OutgoingPacket): OutgoingPacket
    {
        if(!item || !packet) return null;

        const wiredData = item.wiredData.split(':');

        if(wiredData.length > 2) return;

        let ownerOnly   = 0;
        let message     = null;

        if(wiredData.length === 2)
        {
            ownerOnly   = wiredData[0] === '1' ? 1 : 0;
            message     = wiredData[1];
        }
        
        return packet
            .writeBoolean(false)
            .writeInt(Nitro.config.game.furni.wired.maxItems, 0, item.baseItem.spriteId, item.id)
            .writeString(message)
            .writeInt(ownerOnly, 1, this.triggerType, 0, 0);
    }
}