import { CatalogPurchaseFailed } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogPurchaseFailedComposer extends Outgoing
{
    private _error: CatalogPurchaseFailed;

    constructor(error: CatalogPurchaseFailed)
    {
        super(OutgoingHeader.CATALOG_PURCHASE_FAILED);

        this._error = error || CatalogPurchaseFailed.ERROR;
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