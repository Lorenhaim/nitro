import { Incoming } from '../Incoming';

export class CameraSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pictureLength = this.packet.readInt();
            const pictureData = this.packet.readBytes(pictureLength);

            const something     = this.packet.readString();
            const something2    = this.packet.readString();
            const something3    = this.packet.readInt();
            const something4    = this.packet.readInt();

            console.log(something, something2, something3, something4);
            
            //this.client.processOutgoing(new CameraPriceComposer());
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