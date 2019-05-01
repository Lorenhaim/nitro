import { User } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserRespectComposer extends Outgoing
{
    private _user: User;

    constructor(user: User)
    {
        super(OutgoingHeader.USER_RESPECT);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user = user;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._user.id, this._user.details.respectsReceived).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}