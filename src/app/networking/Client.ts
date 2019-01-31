import { Socket } from 'net';

import { Outgoing } from '../packets';

export class Client
{
    private _ip: string;
    private _machineId: string;

    public _pingCount: number;

    constructor(private readonly _socket: Socket)
    {
        this._ip        = _socket.remoteAddress;
        this._machineId = null;
        this._pingCount = null;
    }

    public write(buffer: Buffer): void
    {
        this._socket.write(buffer);
    }

    public async processComposer(composer: any): Promise<boolean>
    {
        if(!(composer instanceof Outgoing)) return Promise.reject(new Error('invalid_composer'));

        const result = await composer.compose();

        if(!result.isPrepared) return Promise.resolve(true);

        this.write(result.buffer);
        console.log(`Sent -> ${ composer.header }`);

        return Promise.resolve(true);
    }

    public dispose()
    {
        this._socket.destroy();
    }

    public socket(): Socket
    {
        return this._socket;
    }

    public get ip(): string
    {
        return this._ip;
    }

    public get machineId(): string
    {
        return this._machineId;
    }

    public set machineId(machineId: string)
    {
        this._machineId = machineId;
    }
}