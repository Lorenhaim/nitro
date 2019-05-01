import { Position } from '../../../../game';
import { Incoming } from '../../Incoming';

export class ItemPlaceEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const data = this.packet.readString();

            if(!data) return;

            const parts = data.split(' ');

            if(!parts) return;

            const itemId = parseInt(parts[0]);

            if(!itemId) return;

            let position: Position = null;

            if(parts[1].startsWith(':w'))
            {
                // needs wall coords validation...

                const width     = parts[1];
                const length    = parts[2];
                const direction = parts[3];

                position = <any> `${ width } ${ length } ${ direction }`;
            }
            else
            {
                const x         = parseInt(parts[1]);
                const y         = parseInt(parts[2]);
                const direction = parseInt(parts[3]);

                position = new Position(x, y, 0, direction, direction);
            }

            if(!position) return;
            
            currentRoom.itemManager.placeItem(this.client.user, itemId, position);
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}