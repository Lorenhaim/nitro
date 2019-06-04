import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserSettingsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_SETTINGS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(100) //volume system
            .writeInt(100) //volume furni
            .writeInt(100) // volume trax
            .writeBoolean(false) // old chat
            .writeBoolean(false) // block room invites
            .writeBoolean(false) // block (camera) follow
            .writeInt(this.client.user.details.toolbarShowFriends ? 1 : 0)
            .writeInt(0) // chat style
            .prepare();
    }
}