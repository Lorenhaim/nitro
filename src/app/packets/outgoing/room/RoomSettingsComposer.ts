import { Room } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomSettingsComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_SETTINGS);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._room.id)
                .writeString(this._room.details.name)
                .writeString(this._room.details.description)
                .writeInt(this._room.details.state)
                .writeInt(this._room.details.categoryId)
                .writeInt(this._room.details.usersMax)
                .writeInt(this._room.details.usersMax)
                .writeInt(0) // tags length, each string
                .writeInt(this._room.details.tradeType)
                .writeInt(this._room.details.allowPets ? 1 : 0)
                .writeInt(this._room.details.allowPetsEat ? 1 : 0)
                .writeInt(this._room.details.allowWalkthrough ? 1 : 0)
                .writeInt(this._room.details.hideWalls ? 1 : 0)
                .writeInt(this._room.details.thicknessWall)
                .writeInt(this._room.details.thicknessFloor)
                .writeInt(this._room.details.chatMode)
                .writeInt(this._room.details.chatWeight)
                .writeInt(this._room.details.chatSpeed)
                .writeInt(this._room.details.chatDistance)
                .writeInt(this._room.details.chatProtection)
                .writeBoolean(false)
                .writeInt(this._room.details.allowMute)
                .writeInt(this._room.details.allowKick)
                .writeInt(this._room.details.allowBan)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}