import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class FastWalkCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'fast_walk');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        const speed = !parts[0] ? 0 : parseInt(parts[0]);

        if(speed)
        {
            if(user.unit.location.isFastWalking) return user.unit.location.fastWalk(true, speed);
        }

        if(user.unit.location.isFastWalking) return user.unit.location.fastWalk(false);
        else return user.unit.location.fastWalk(true, speed);
    }

    public get description(): string
    {
        return 'Fast walks';
    }
}