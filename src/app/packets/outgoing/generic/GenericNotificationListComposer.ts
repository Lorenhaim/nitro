import { NotificationList } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GenericNotificationListComposer extends Outgoing
{
    private _notificationList: NotificationList;

    constructor(notificationList: NotificationList)
    {
        super(OutgoingHeader.NOTIFICATION);

        if(!notificationList) throw new Error('invalid_notification');

        this._notificationList = notificationList;
    }

    public compose(): OutgoingPacket
    {
        const totalItems = this._notificationList.items.length;

        if(!totalItems) return this.cancel();

        this.packet.writeString(this._notificationList.type);
        
        this.packet.writeInt(totalItems);

        for(let i = 0; i < totalItems; i++)
        {
            const item = this._notificationList.items[i];

            this.packet.writeString(item.key, item.value);
        }
        
        return this.packet.prepare();
    }
}