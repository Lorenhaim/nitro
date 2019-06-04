import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityTicketComposer extends Outgoing
{
    private _success: boolean;
    private _ticket: string;

    constructor(success: boolean, ticket?: string)
    {
        super(OutgoingHeader.SECURITY_TICKET);

        this._success   = success || false;
        this._ticket    = ticket || null;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeBoolean(this._success);
            
        if(this._ticket) this.packet.writeString(this._ticket);

        return this.packet.prepare();
    }
}