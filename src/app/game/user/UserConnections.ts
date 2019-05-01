import { GameClient, SocketClient } from '../../networking';
import { Outgoing } from '../../packets';
import { User } from './User';

export class UserConnections
{
    private _user: User;

    private _gameClient: GameClient;
    private _socketClient: SocketClient;

    private _isDisposed: boolean;
    private _isDisposing: boolean;
    
    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._gameClient    = null;
        this._socketClient  = null;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            if(this._gameClient !== null)   await this._gameClient.dispose();
            if(this._socketClient !== null) await this._socketClient.dispose();

            this._isDisposed    = true;
            this._isDisposing   = false;
        }
    }

    public processOutgoing(...outgoing: Outgoing[]): void
    {
        if(this._gameClient)    this._gameClient.processOutgoing(...outgoing);
        if(this._socketClient)  this._socketClient.processOutgoing(...outgoing);
    }

    public async setGameClient(client: GameClient)
    {
        if(this._gameClient)
        {
            this._gameClient.willDestroyUser = false;

            await this._gameClient.dispose();
        }

        this._gameClient = client;

        if(this._socketClient)
        {
            this._gameClient.willDestroyUser    = false;
            this._socketClient.willDestroyUser  = false;
        }
    }

    public async disposeGameClient(runDisposer: boolean = true)
    {
        if(this._gameClient)
        {
            this._gameClient.willDestroyUser = this._socketClient ? false : this._gameClient.willDestroyUser;

            if(runDisposer) await this._gameClient.dispose();

            this._gameClient = null;

            if(this._socketClient) this._socketClient.willDestroyUser = true;
        }
    }

    public async setSocketClient(client: SocketClient)
    {
        if(this._socketClient)
        {
            this._socketClient.willDestroyUser = false;

            await this._socketClient.dispose();
        }

        this._socketClient = client;

        if(this._gameClient)
        {
            this._socketClient.willDestroyUser  = false;
            this._gameClient.willDestroyUser    = false;
        }
    }

    public async disposeSocketClient(runDisposer: boolean = true)
    {
        if(this._socketClient)
        {
            this._socketClient.willDestroyUser = this._gameClient ? false : this._socketClient.willDestroyUser;

            if(runDisposer) await this._socketClient.dispose();

            this._socketClient = null;

            if(this._gameClient) this._gameClient.willDestroyUser = true;
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get gameClient(): GameClient
    {
        return this._gameClient;
    }

    public get socketClient(): SocketClient
    {
        return this._socketClient;
    }

    public get isConnected(): boolean
    {
        return this._gameClient instanceof GameClient || this._socketClient instanceof SocketClient;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}