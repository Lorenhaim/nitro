import { MessengerCategoryEntity } from '../../../database';
import { OutgoingPacket } from '../../../packets';

export class MessengerCategory
{
    private _entity: MessengerCategoryEntity;

    constructor(entity: MessengerCategoryEntity)
    {
        if(!(entity instanceof MessengerCategoryEntity)) throw new Error('invalid_entity');

        this._entity = entity;
    }

    public parseCategory(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        return packet.writeInt(this._entity.id).writeString(this._entity.name);
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }
}