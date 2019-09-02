import { Manager } from '../common';

export abstract class Server<T> extends Manager
{
    protected _server: T;

    protected _ip: string;
    protected _port: number;

    constructor(serverName: string)
    {
        super(serverName);

        this._ip    = null;
        this._port  = null;
    }

    public abstract listen(ip: string, port: number): void;

    public get server(): T
    {
        return this._server;
    }
}