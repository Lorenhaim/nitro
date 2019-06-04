import { UserEntity } from '../../../../database';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerSearchComposer extends Outgoing
{
    private _friends: UserEntity[];
    private _others: UserEntity[];

    constructor(friends: UserEntity[], others: UserEntity[])
    {
        super(OutgoingHeader.MESSENGER_SEARCH);

        this._friends   = friends;
        this._others    = others;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const totalFriends = this._friends.length;

            if(totalFriends)
            {
                this.packet.writeInt(totalFriends);

                for(let i = 0; i < totalFriends; i++) this.parseResult(this._friends[i]);
            }
            else this.packet.writeInt(0);

            const totalOthers = this._others.length;

            if(totalOthers)
            {
                this.packet.writeInt(totalOthers);

                for(let i = 0; i < totalOthers; i++) this.parseResult(this._others[i]);
            }
            else this.packet.writeInt(0);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }

    private parseResult(result: UserEntity): void
    {
        if(!result) return;

        this.packet
            .writeInt(result.id)
            .writeString(result.username)
            .writeString(result.motto)
            .writeBoolean(false, false)
            .writeString(null)
            .writeInt(1)
            .writeString(result.online === '1' ? result.figure : null)
            .writeString(null);
    }
}