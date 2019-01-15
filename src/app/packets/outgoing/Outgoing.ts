import { User } from '../../game';

import { OutgoingHeader } from './OutgoingHeader';
import { OutgoingPacket } from './OutgoingPacket';

export abstract class Outgoing
{
    private _packet: OutgoingPacket;

    constructor(private readonly _header: OutgoingHeader, private readonly _user: User)
    {
        if(!(_user instanceof User)) throw new Error('invalid_user');
        
        this._packet = new OutgoingPacket(_header);
    }

    public get header()
    {
        return this._header;
    }

    public get packet()
    {
        return this._packet;
    }

    public get user()
    {
        return this._user;
    }

    public abstract async compose(): Promise<Buffer>;
}