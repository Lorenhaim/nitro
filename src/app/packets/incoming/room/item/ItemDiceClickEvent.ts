import { Incoming } from '../../Incoming';

export class ItemDiceClickEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                if(this.client.user.unit.canLocate)
                {
                    const item = currentRoom.itemManager.getItem(this.packet.readInt());

                    if(item)
                    {
                        const interaction: any = item.baseItem.interaction;

                        if(interaction)
                        {
                            if(interaction.onClick) interaction.onClick(this.client.user.unit, item, this.packet.readInt());
                        }
                    }
                }
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