import { RedeemItemEvent } from '../../../../game/user/events';
import { Incoming } from '../../Incoming';

export class ItemRedeemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                const item = currentRoom.itemManager.getItem(this.packet.readInt());

                if(item) this.client.user.events.next(new RedeemItemEvent(item));
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}