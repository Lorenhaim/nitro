import { CatalogPurchaseUnavailable } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogPurchaseUnavailableComposer extends Outgoing
{
    private _error: CatalogPurchaseUnavailable;

    constructor(error: CatalogPurchaseUnavailable)
    {
        super(OutgoingHeader.CATALOG_PURCHASE_UNAVAILABLE);

        this._error = error || CatalogPurchaseUnavailable.ILLEGAL;
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