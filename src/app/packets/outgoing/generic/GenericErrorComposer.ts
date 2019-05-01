import { GenericError } from '../../../common';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GenericErrorComposer extends Outgoing
{
    private _error: GenericError;

    constructor(error: GenericError)
    {
        super(OutgoingHeader.GENERIC_ERROR);

        this._error = error || 0;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._error).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}