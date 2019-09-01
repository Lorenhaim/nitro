import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class HandItemCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'hi', 'hand_item');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        user.unit.location.hand(parseInt(parts[0]));
    }

    public get usage(): string
    {
        return '< handItemid? >';
    }

    public get description(): string
    {
        return 'Hand item';
    }
}