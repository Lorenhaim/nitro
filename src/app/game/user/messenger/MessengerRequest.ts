import { MessengerRequestEntity } from '../../../database';
import { OutgoingPacket } from '../../../packets';

export class MessengerRequest
{
    private _entity: MessengerRequestEntity;

    constructor(entity: MessengerRequestEntity)
    {
        if(!(entity instanceof MessengerRequestEntity)) throw new Error('invalid_entity');

        this._entity = entity;
    }

    public parseRequest(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        return packet.writeInt(this._entity.userId).writeString(this._entity.user.username, this._entity.user.figure);
    }

    public get id(): number
    {
        return this._entity.userId;
    }

    public get username(): string
    {
        return this._entity.user.username;
    }

    public get figure(): string
    {
        return this._entity.user.figure;
    }
}