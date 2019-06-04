import { existsSync, writeFile } from 'fs';
import { TimeHelper } from '../../../common';
import { Emulator } from '../../../Emulator';
import { CameraUrlComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class CameraSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pictureLength = this.packet.readInt();

            if(!pictureLength) return;

            const pictureData = this.packet.readBuffer(pictureLength);

            const savePath = Emulator.config.game.camera.savePath;

            if(!savePath) return;

            const fileName = `${ this.client.user.id }_${ TimeHelper.currentTimestamp }.png`;

            try
            {
                if(existsSync(savePath + fileName)) return;

                writeFile(savePath + fileName, pictureData, 'binary', err =>
                {
                    if(err) throw err;

                    return this.client.processOutgoing(new CameraUrlComposer(Emulator.config.game.camera.saveUrl + fileName));
                });
            }
            
            catch(err)
            {
                this.error(err);
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