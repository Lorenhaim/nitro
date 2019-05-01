import { MessengerFriendEntity } from '../../../database';
import { OutgoingPacket } from '../../../packets';
import { MessengerRelationshipType } from './interfaces';

export class MessengerFriend
{
    private _id: number;
    private _username: string;
    private _motto: string;
    private _gender: 'M' | 'F';
    private _figure: string;
    private _online: boolean;
    private _relation: MessengerRelationshipType;

    private _categoryId: number;

    constructor(entity: MessengerFriendEntity)
    {
        if(!(entity instanceof MessengerFriendEntity)) throw new Error('invalid_entity');

        this._id            = entity.friend.id;
        this._username      = entity.friend.username;
        this._motto         = entity.friend.motto;
        this._gender        = entity.friend.gender;
        this._figure        = entity.friend.figure;
        this._online        = entity.friend.online === '1';
        this._relation      = parseInt(<any> entity.relation);

        this._categoryId    = entity.categoryId || 0;
    }

    public parseFriend(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        return packet
            .writeInt(this._id) // group 0
            .writeString(this._username) // group name
            .writeInt(this._gender === 'M' ? 0 : 1) // group 0
            .writeBoolean(this._online) // group true/false ??
            .writeBoolean(false) // in room
            .writeString(this._figure) // group badge code
            .writeInt(this._categoryId)
            .writeString(this._motto)
            .writeString(null, null)
            .writeBoolean(false) // offline messaging
            .writeBoolean(false)
            .writeBoolean(false) // pocket habbo
            .writeShort(this._relation);
    }

    public get id(): number
    {
        return this._id;
    }

    public get username(): string
    {
        return this._username;
    }

    public set username(username: string)
    {
        this._username = username;
    }

    public get motto(): string
    {
        return this._motto;
    }

    public set motto(motto: string)
    {
        this._motto = motto;
    }

    public get gender(): 'M' | 'F'
    {
        return this._gender;
    }

    public set gender(gender: 'M' | 'F')
    {
        this._gender = gender;
    }

    public get figure(): string
    {
        return this._figure;
    }

    public set figure(figure: string)
    {
        this._figure = figure;
    }

    public get online(): boolean
    {
        return this._online;
    }

    public set online(online: boolean)
    {
        this._online = online;
    }

    public get categoryId(): number
    {
        return this._categoryId;
    }

    public get relation(): 0 | 1 | 2 | 3
    {
        return this._relation;
    }

    public set relation(relation: 0 | 1 | 2 | 3)
    {
        this._relation = relation;
    }
}