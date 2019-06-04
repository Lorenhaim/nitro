import { Group } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupBadgesComposer extends Outgoing
{
    private _groups: Group[];

    constructor(...groups: Group[])
    {
        super(OutgoingHeader.GROUP_BADGES);

        if(!groups) throw new Error('invalid_groups');

        this._groups = [ ...groups ];
    }

    public compose(): OutgoingPacket
    {
        const totalGroups = this._groups.length;

        if(!totalGroups) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalGroups);

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            this.packet.writeInt(group.id).writeString(group.badge);
        }

        return this.packet.prepare();
    }
}