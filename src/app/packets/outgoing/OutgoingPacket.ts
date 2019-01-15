import { OutgoingHeader } from './OutgoingHeader';
import { PacketEncoder } from './PacketEncoder';

export class OutgoingPacket
{
    private _bytes: number[];
    private _isPrepared: boolean;

    constructor(private readonly _header: OutgoingHeader)
    {
        this._bytes         = [];
        this._isPrepared    = false;

        this.writeShort(_header);
    }

    public prepare(): void
    {
        if(this._isPrepared) return;

        this._bytes = PacketEncoder.encodeInt(this._bytes.length).concat(this._bytes);

        this._isPrepared = true;
    }

    private writeBytes(bytes: any[]): void
    {
        if(this._isPrepared) return;

        for(let i = 0; i < bytes.length; i++) this._bytes.push(bytes[i]);
    }

    public writeInt(number: number): void
    {
        const bytes = PacketEncoder.encodeInt(number);

        this.writeBytes(bytes);
    }

    public writeShort(number: number): void
    {
        const bytes = PacketEncoder.encodeShort(number);

        this.writeBytes(bytes);
    }

    public writeBoolean(flag: boolean): void
    {
        const bytes = PacketEncoder.encodeBoolean(flag);

        this.writeBytes([bytes]);
    }

    public writeString(string: string): void
    {
        if(!string) string = "";
        
        const bytes = PacketEncoder.encodeString(string);

        this.writeShort(string.length);
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

    public get buffer(): Buffer
    {
        return Buffer.from(this._bytes);
    }
}