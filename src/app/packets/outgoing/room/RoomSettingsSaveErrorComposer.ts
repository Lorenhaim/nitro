import { RoomSettingsSaveError } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomSettingsSaveErrorComposer extends Outgoing
{
    private _roomId: number;
    private _errorCode: RoomSettingsSaveError;
    private _message: string;

    constructor(roomId: number, errorCode: RoomSettingsSaveError, message: string = null)
    {
        super(OutgoingHeader.ROOM_SETTINGS_SAVE_ERROR);

        if(!roomId || !errorCode) throw new Error('invalid_save');

        this._roomId    = roomId;
        this._errorCode = errorCode;
        this._message   = message;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._roomId, this._errorCode).writeString(this._message).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}