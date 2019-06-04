import { PermissionList } from '../security';
import { User } from '../user';

export abstract class Command
{
    private _permission: PermissionList;
    private _aliases: string[];

    constructor(permission: PermissionList, ...nameOrAliases: string[])
    {
        const aliases = [ ...nameOrAliases ];

        if(!aliases || !aliases.length) throw new Error('invalid_alias');

        this._permission    = permission || PermissionList.NONE;
        this._aliases       = aliases;
    }

    public abstract async process(user: User, parts: string[]): Promise<void>;

    public get permission(): PermissionList
    {
        return this._permission;
    }

    public get aliases(): string[]
    {
        return this._aliases;
    }

    public abstract get description(): string;
}