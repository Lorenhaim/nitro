import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class EffectCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'e', 'effect');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        user.unit.location.effect(parseInt(parts[0]));
    }

    public get usage(): string
    {
        return '< effectId? >';
    }

    public get description(): string
    {
        return 'Effect';
    }
}