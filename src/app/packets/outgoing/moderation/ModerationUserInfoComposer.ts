import { TimeHelper } from '../../../common';
import { User } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ModerationUserInfoComposer extends Outgoing
{
    private _user: User;

    constructor(user: User)
    {
        super(OutgoingHeader.MOD_TOOL_USER_INFO);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user = user;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._user.id)
                .writeString(this._user.details.username, this._user.details.figure)
                .writeInt((TimeHelper.currentTimestamp - TimeHelper.to(this._user.details.timestampCreated, 'milliseconds')) * 60) // created
                .writeInt(TimeHelper.to(this._user.details.timestampCreated, 'seconds')) // last online
                .writeBoolean(this._user.details.online)
                .writeInt(0, 0, 0, 0, 0)
                .writeString('', '')
                .writeInt(this._user.id, 0)
                .writeString(this._user.details.username)
                .writeString('test')
                .writeString('test')
                .writeInt(31)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}