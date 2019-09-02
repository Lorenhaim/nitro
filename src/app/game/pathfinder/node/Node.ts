import { Nitro } from '../../../Nitro';
import { Position } from '../Position';

export class Node
{
    private _position: Position;
    private _nextNode: Node;

    private _cost: number;
    private _isOpen: boolean;
    private _isClosed: boolean;

    constructor(position: Position)
    {
        this._position  = position;
        this._nextNode  = null;

        this._cost      = Nitro.config.game.pathfinder.node.cost;
        this._isOpen    = false;
        this._isClosed  = false;
    }

    public get position(): Position
    {
        return this._position;
    }

    public set position(position: Position)
    {
        this._position = position;
    }

    public get nextNode(): Node
    {
        return this._nextNode;
    }

    public set nextNode(node: Node)
    {
        this._nextNode = node;
    }

    public get cost(): number
    {
        return this._cost;
    }

    public set cost(cost: number)
    {
        this._cost = cost;
    }

    public get isOpen(): boolean
    {
        return this._isOpen;
    }

    public set isOpen(status: boolean)
    {
        this._isOpen = status;
    }

    public get isClosed(): boolean
    {
        return this._isClosed;
    }

    public set isClosed(status: boolean)
    {
        this._isClosed = status;
    }
}