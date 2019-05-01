import { Incoming } from '../../Incoming';

export class ItemDiceCloseEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                const item = currentRoom.itemManager.getItem(this.packet.readInt());

                if(item)
                {
                    const interaction: any = item.baseItem.interaction;

                    if(interaction)
                    {
                        if(interaction.onClickAlternative) interaction.onClickAlternative(this.client.user.unit, item);
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