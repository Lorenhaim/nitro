import { OutgoingHeader } from './OutgoingHeader';
import { PacketEncoder } from './PacketEncoder';

export class OutgoingPacket
{
    private _header: OutgoingHeader;
    private _bytes: number[];
    private _encoded: { type: string, value: string }[];

    private _isPrepared: boolean;
    private _isCancelled: boolean;

    constructor(header: OutgoingHeader)
    {
        this._header        = header || null;
        this._bytes         = [];
        this._encoded       = [];

        this._isPrepared    = false;
        this._isCancelled   = false;

        if(header) this.writeShort(header);
    }

    public writeBytes(...bytes: number[]): this
    {
        if(!this._isPrepared && !this._isCancelled) this._bytes.push(...bytes);

        return this;
    }

    public writeInt(...numbers: number[]): this
    {
        for(let number of numbers)
        {
            this.writeBytes(...PacketEncoder.encodeInt(number));
            this._encoded.push({ type: 'int', value: number.toString() });
        }

        return this;
    }

    public writeShort(...numbers: number[]): this
    {
        for(let number of numbers)
        {
            this.writeBytes(...PacketEncoder.encodeShort(number));
            this._encoded.push({ type: 'short', value: number.toString() });
        }

        return this;
    }

    public writeString(...strings: string[]): this
    {
        for(let string of strings)
        {
            if(string)
            {
                this.writeShort(string.length).writeBytes(...PacketEncoder.encodeString(string));
                this._encoded.push({ type: 'string', value: string });
            }
            else
            {
                this.writeShort(0);
            }
        }

        return this;
    }

    public writeBoolean(...flags: boolean[]): this
    {
        for(let flag of flags)
        {
            this.writeBytes(PacketEncoder.encodeBoolean(flag));
            this._encoded.push({ type: 'boolean', value: flag ? 'true' : 'fase' });
        }

        return this;
    }

    public prepare(): this
    {
        if(!this._isPrepared && this._header)
        {
            this.bytes.unshift(...PacketEncoder.encodeInt(this._bytes.length));

            this._isPrepared = true;
        }

        return this;
    }

    public cancel(): this
    {
        this._bytes         = [];
        this._isCancelled   = true;

        return this;
    }

    public get header(): OutgoingHeader
    {
        return this._header;
    }

    public get bytes(): number[]
    {
        return this._bytes;
    }

    public get encoded(): { type: string, value: string }[]
    {
        return this._encoded;
    }

    public get isPrepared(): boolean
    {
        return this._isPrepared;
    }

    public get isCancelled(): boolean
    {
        return this._isCancelled;
    }

    public get buffer(): Buffer
    {
        return Buffer.from(this._bytes);
    }
}