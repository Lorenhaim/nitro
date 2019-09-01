import { PermissionList } from '../security';
import { UnitGender } from '../unit';
import { User } from '../user';
import { Command } from './Command';

export class SetFigureCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'sf', 'set_figure');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        const figure    = parts[0] || null;
        const gender    = parts[1] || UnitGender.MALE;

        if(!figure) return;

        user.details.updateFigure(figure, <UnitGender> gender);
    }

    public get usage(): string
    {
        return '< figure, gender? >';
    }

    public get description(): string
    {
        return 'Manually set your figure';
    }
}