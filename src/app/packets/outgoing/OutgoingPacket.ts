import { OutgoingHeader } from './OutgoingHeader';
import { PacketEncoder } from './PacketEncoder';

export class OutgoingPacket
{
    private _bytes: number[];
    private _encoded: { type: 'int' | 'short' | 'boolean' | 'string', value: number | boolean | string }[];

    private _isPrepared: boolean;
    private _isCancelled: boolean;

    constructor(private readonly _header: OutgoingHeader)
    {
        this._bytes         = [];
        this._encoded       = [];

        this._isPrepared    = false;
        this._isCancelled   = false;

        this.writeShort(_header);
    }

    public prepare(): void
    {
        if(this._isPrepared) return;

        this._bytes = PacketEncoder.encodeInt(this._bytes.length).concat(this._bytes);

        this._isPrepared = true;
    }

    public cancel(): void
    {
        this._bytes         = [];
        this._isCancelled   = true;
    }

    private writeBytes(bytes: any[]): void
    {
        if(this._isPrepared || this._isCancelled) return;

        for(let i = 0; i < bytes.length; i++) this._bytes.push(bytes[i]);
    }

    public writeInt(number: number): void
    {
        const bytes = PacketEncoder.encodeInt(number);

        this._encoded.push({ type: 'int', value: number });
        this.writeBytes(bytes);
    }

    public writeShort(number: number): void
    {
        const bytes = PacketEncoder.encodeShort(number);

        this._encoded.push({ type: 'short', value: number });
        this.writeBytes(bytes);
    }

    public writeBoolean(flag: boolean): void
    {
        const bytes = PacketEncoder.encodeBoolean(flag);

        this._encoded.push({ type: 'boolean', value: flag });

        this.writeBytes([bytes]);
    }

    public writeString(string: string): void
    {
        if(!string) string = "";
        
        const bytes = PacketEncoder.encodeString(string);

        this.writeShort(string.length);

        this._encoded.push({ type: 'string', value: string });
        this.writeBytes(bytes);
    }

    public get header(): OutgoingHeader
    {
        return this._header;
    }

    public get isPrepared(): boolean
    {
        return this._isPrepared;
    }

    public get isCancelled(): boolean
    {
        return this._isCancelled;
    }

    public get encoded()
    {
        return this._encoded;
    }

    public get buffer(): Buffer
    {
        return Buffer.from(this._bytes);
    }
}