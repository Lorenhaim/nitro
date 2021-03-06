import { Room, RoomMuteType } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomInfoComposer extends Outgoing
{
    private _room: Room;
    private _someBoolean: boolean;
    private _someBoolean2: boolean;

    constructor(room: Room, someBoolean: boolean = false, someBoolean2: boolean = false)
    {
        super(OutgoingHeader.ROOM_INFO);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room          = room;
        this._someBoolean   = someBoolean;
        this._someBoolean2  = someBoolean2;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeBoolean(this._someBoolean2);

        this._room.parseInfo(this.packet);

        this.packet
            .writeBoolean(this._someBoolean, false, this._room.group && this._room.group.getMembership(this.client.user) !== null, false) // last false is (isMuted)
            .writeInt(this._room.details.allowMute, this._room.details.allowKick, this._room.details.allowBan)
            .writeBoolean(this._room.details.allowMute === RoomMuteType.RIGHTS && this._room.securityManager.hasRights(this.client.user) || this._room.securityManager.isOwner(this.client.user)); // mute all

        this._room.parseChatSettings(this.packet);
            
        return this.packet.prepare();
    }
}