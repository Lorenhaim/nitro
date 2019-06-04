import { IncomingHeader } from './incomingHeader';

export class IncomingPacket
{
    private _buffer: Buffer;
    private _bytes: number[];
    private _bytesLength: number;

    private _length: number;
    private _header: IncomingHeader;
    private _offset: number;

    constructor(_bytes: Buffer)
    {
        this._buffer        = _bytes;
        this._bytes         = [ ..._bytes ];
        this._bytesLength   = this._bytes.length;

        this._offset        = 0;
        this._length        = this.readInt();
        this._header        = this.readShort();
        
        if(this._header < 1) this._header = 0;
    }

    public readBuffer(size: number): Buffer
    {
        if(this.remainingBytes < size) return null;

        const result = this._buffer.slice(this._offset, (this._offset + size));

        this._offset = this._offset + size;

        return result;
    }

    public readBytes(size: number): number[]
    {
        if(this.remainingBytes < size) return null;

        const result = this._bytes.slice(this._offset, (this._offset + size));

        this._offset = this._offset + size;

        return result;
    }

    public readRemainingBytes(): number[]
    {
        return this.readBytes(this.remainingBytes);
    }

    public readInt(): number
    {
        const bytes = this.readBytes(4);

        if(bytes && bytes.length === 4)
        {
            if(bytes[0] >= 0 && bytes[1] >= 0 && bytes[2] >= 0 && bytes[3] >= 0)
            {
                return (bytes[0] * 16777216) + (bytes[1] * 65536) + (bytes[2] * 256) + (bytes[3]);
            }
            else
            {
                return -2;
            }
        }
        else
        {
            return -1;
        }
    }

    public readShort(): number
    {
        const bytes = this.readBytes(2);

        if(bytes && bytes.length === 2)
        {
            if(bytes[0] >= 0 && bytes[1] >= 0)
            {
                return (bytes[0] * 256) + (bytes[1]);
            }
            else
            {
                return -2;
            }
        }
        else
        {
            return -1;
        }
    }

    public readString(): string
    {
        let result = '';

        const stringLength = this.readShort();

        if(stringLength)
        {
            const bytes = this.readBytes(stringLength);

            if(bytes) for(let i = 0; i < stringLength; i++) result += String.fromCharCode(bytes[i]);
        }

        return result !== '' ? result : null;
    }

    public readBoolean(): boolean
    {
        return this.readBytes(1)[0] === 1;
    }

    public get buffer(): Buffer
    {
        return this._buffer;
    }

    public get bytes(): number[]
    {
        return this._bytes;
    }

    public get bytesLength(): number
    {
        return this._bytesLength;
    }

    public get packetLength(): number
    {
        return this._length;
    }

    public get remainingBytes(): number
    {
        return (this.packetLength + 4) - this._offset;
    }

    public get bytesAvailable(): boolean
    {
        return this.remainingBytes > 0;
    }

    public get header(): IncomingHeader
    {
        return this._header;
    }
}