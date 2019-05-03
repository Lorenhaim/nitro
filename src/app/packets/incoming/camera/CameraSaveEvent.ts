import { Incoming } from '../Incoming';

export class CameraSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pictureLength = this.packet.readInt();
            const pictureData   = this.packet.readBytes(pictureLength);

            // console.log(pictureLength, pictureData);
            
            // const buffer = Buffer.alloc(pictureLength);

            // for(let i = 0; i < pictureLength; i++) buffer[i] = pictureData[i];

            // writeFile('./camera/picture.png', buffer, 'binary', err =>
            // {
            //     if(err) console.log(err);
            //     else console.log('done!');
            // });

            //const something     = this.packet.readString();
            //const something2    = this.packet.readString();
            //const something3    = this.packet.readInt();
            //const something4    = this.packet.readInt();
            
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