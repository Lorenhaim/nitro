import { IncomingHeader } from './incomingHeader';

export class IncomingPacket
{
    private _bufferLength: number;

    private _length: number;
    private _header: IncomingHeader;
    private _offset: number;
    private _decoded: any[];

    constructor(private readonly _buffer: Buffer)
    {
        if(!(_buffer instanceof Buffer)) throw new Error('invalid_buffer');

        this._bufferLength  = _buffer.length;
        this._offset        = 0;
        this._decoded       = [];
        this._length        = this.readInt();
        this._header        = this.readShort();
        
        if(this._header < 1) this._header = 0;
    }

    public get bufferLength(): number
    {
        return this._bufferLength;
    }

    public get packetLength(): number
    {
        return this._length;
    }

    public get remainingBytes(): number
    {
        return (this._length + 4) - this._offset;
    }

    public get header(): IncomingHeader
    {
        return this._header;
    }

    public readBytes(size: number): Buffer
    {
        if(this.remainingBytes < size) return null;

        const result = this._buffer.slice(this._offset, (this._offset + size));

        this._offset = this._offset + size;

        return result;
    }

    public readInt(): number
    {
        const bytes = this.readBytes(4);

        if(bytes === null || bytes.length !== 4) return -1;

        if(bytes[0] < 0 || bytes[1] < 0 || bytes[2] < 0 || bytes[3] < 0) return -2;

        const result = (bytes[0] * 16777216) + (bytes[1] * 65536) + (bytes[2] * 256) + (bytes[3]);

        this._decoded.push(result);

        return result;
    }

    public readShort(): number
    {
        const bytes = this.readBytes(2);

        if(bytes == null || bytes.length !== 2) return -1;
        
        if(bytes[0] < 0 || bytes[1] < 0) return -2;
        
        const result = (bytes[0] * 256) + (bytes[1]);

        this._decoded.push(result);

        return result;
    }

    public readBoolean(): boolean
    {
        const byte = this.readBytes(1);

        if(!byte || byte.length !== 1) return false;

        const result = byte[0] === 1;

        this._decoded.push(result);

        return result;
    }

    public readString(): string
    {
        const stringLength  = this.readShort();
        const stringBytes   = stringLength ? this.readBytes(stringLength) : null;

        if(!stringBytes) return null;

        let result = '';

        for(let i = 0; i < stringBytes.length; i++) result += String.fromCharCode(stringBytes[i]);

        this._decoded.push(result);

        return result;
    }
}