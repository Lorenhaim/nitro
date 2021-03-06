import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class FastWalkCommand extends Command
{
    constructor()
    {
        super(PermissionList.FAST_WALK, 'fast_walk', 'fw');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        const speed = !parts[0] ? 1 : parseInt(parts[0]);

        if(!speed) return user.unit.location.fastWalk(false);
        
        return user.unit.location.fastWalk(true, speed);
    }

    public get usage(): string
    {
        return `< speed? >`;
    }

    public get description(): string
    {
        return 'Increases amount of steps taken each cycle';
    }
}