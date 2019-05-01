import { Incoming } from '../Incoming';

export class ClientEventTrackerEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const component = this.packet.readString();
            const title     = this.packet.readString();
            const action    = this.packet.readString();
            const data      = this.packet.readString();
            const extraData = this.packet.readInt();

            //console.log(component, title, action, data, extraData);
        }

        catch(err)
        {
            this.error(err);
        }
    }
}