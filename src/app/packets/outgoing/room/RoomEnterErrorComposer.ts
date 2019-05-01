import { RoomEnterError } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomEnterErrorComposer extends Outgoing
{
    private _errorCode: RoomEnterError;

    constructor(errorCode: RoomEnterError)
    {
        super(OutgoingHeader.ROOM_ENTER_ERROR);

        this._errorCode = errorCode || RoomEnterError.NO_ENTRY;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._errorCode)
            {
                this.packet.writeInt(this._errorCode);
                this.packet.writeString('');
                    
                this.packet.prepare();

                return this.packet;
            }
            
            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}