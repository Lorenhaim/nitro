import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogModeComposer extends Outgoing
{
    private _mode: 0 | 1;

    constructor(mode: 0 | 1)
    {
        super(OutgoingHeader.CATALOG_MODE);

        this._mode = mode || 0;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._mode).prepare();
    }
}