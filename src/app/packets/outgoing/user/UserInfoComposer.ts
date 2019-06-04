import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserInfoComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_INFO);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this.client.user.id)
            .writeString(this.client.user.details.username, this.client.user.details.figure, this.client.user.details.gender.toUpperCase(), this.client.user.details.motto, this.client.user.details.username)
            .writeBoolean(false)
            .writeInt(this.client.user.details.respectsReceived, this.client.user.details.respectsRemaining, this.client.user.details.respectsPetRemaining)
            .writeBoolean(false)
            //.writeString(TimeHelper.formatDate(this.client.user.details.timestampCreated, 'YYYY-MM-DD HH:mm:ss'))
            .writeString('01-01-1970 00:00:00')
            .writeBoolean(false, false) // first name change
            .prepare();
    }
}