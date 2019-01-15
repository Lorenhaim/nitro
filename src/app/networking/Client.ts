import { Socket } from 'net';

import { Outgoing } from '../packets';

export class Client
{
    constructor(private readonly _socket: Socket) {}

    public write(buffer: Buffer): void
    {
        this._socket.write(buffer);
    }

    public async processComposer(composer: any): Promise<boolean>
    {
        if(!(composer instanceof Outgoing)) return Promise.reject(new Error('invalid_composer'));

        this.write(await composer.compose());
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
        return this._socket.remoteAddress;
    }
}