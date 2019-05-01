import { Incoming } from '../Incoming';

export class UserFigureEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const gender    = this.packet.readString();
            const figure    = this.packet.readString();

            this.client.user.details.updateFigure(figure, <any> gender);
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