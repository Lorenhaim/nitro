import { Group } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupInfoComposer extends Outgoing
{
    private _group: Group;
    private _newWindow: boolean;
    private _isUpdate: boolean;

    constructor(group: Group, newWindow: boolean, isUpdate: boolean = false)
    {
        super(OutgoingHeader.GROUP_INFO);

        if(!(group instanceof Group)) throw new Error('invalid_group');

        this._group     = group;
        this._newWindow = newWindow;
        this._isUpdate  = isUpdate;
    }

    public compose(): OutgoingPacket
    {
        return this._group.parseInfo(this.packet, this.client.user, this._newWindow, this._isUpdate).prepare();
    }
}