import { PermissionList } from '../../../game';
import { Incoming } from '../Incoming';

export class ModerationReportEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            //return this.client.processOutgoing(new ModerationReportDisabledComposer());

            const message       = this.packet.readString();
            const topic         = this.packet.readInt();
            const userId        = this.packet.readInt();
            const roomId        = this.packet.readInt();

            const messages: number[] = [];

            const totalMessages = this.packet.readInt();

            console.log(totalMessages);

            if(totalMessages) for(let i = 0; i < totalMessages; i++) messages.push(this.packet.readInt());

            console.log(`message: ${ message }`);
            console.log(`topic: ${ topic }`);
            console.log(`userId: ${ userId }`);
            console.log(`roomId: ${ roomId }`);
            console.log(`messages: ${ messages }`);
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

    public get permissionRequired(): string[]
    {
        return [ PermissionList.MOD_TOOL ];
    }
}