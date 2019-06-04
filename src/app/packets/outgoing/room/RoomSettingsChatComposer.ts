import { Room } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomSettingsChatComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_SETTINGS_CHAT);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        this._room.parseChatSettings(this.packet);

        return this.packet.prepare();
    }
}