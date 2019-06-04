import { Group } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupSettingsComposer extends Outgoing
{
    private _group: Group;

    constructor(group: Group)
    {
        super(OutgoingHeader.GROUP_SETTINGS);

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group = group;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(1)
            .writeInt(this._group.roomId)
            .writeString(this._group.roomName)
            .writeBoolean(false)
            .writeBoolean(true)
            .writeInt(this._group.id)
            .writeString(this._group.name)
            .writeString(this._group.description)
            .writeInt(this._group.roomId)
            .writeInt(0) // color 1
            .writeInt(0) // color 2
            .writeInt(this._group.state)
            .writeInt(this._group.memberRights ? 1 : 0) // rights
            .writeBoolean(false)
            .writeString('')
            .writeInt(0)
            .writeString(this._group.badge)
            .writeInt(this._group.totalMembers)
            .prepare();
    }
}