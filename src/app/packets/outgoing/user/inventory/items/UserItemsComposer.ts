import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserItemsComposer extends Outgoing
{
    private _totalPages: number;
    private _currentPage: number;
    private _currentItems: Item[];

    constructor(totalPages: number, currentPage: number, currentItems: Item[])
    {
        super(OutgoingHeader.USER_ITEMS);

        this._totalPages    = totalPages || 0;
        this._currentPage   = currentPage || 0;
        this._currentItems  = currentItems || [];
    }

    public compose(): OutgoingPacket
    {
       const totalItems = this._currentItems.length;

       if(!totalItems) return this.packet.writeInt(1, 0, 0).prepare();
       
       this.packet
            .writeInt(this._totalPages)
            .writeInt(this._currentPage - 1)
            .writeInt(totalItems);

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._currentItems[i];

            item.parseInventoryData(this.packet);
        }

        return this.packet.prepare();
    }
}