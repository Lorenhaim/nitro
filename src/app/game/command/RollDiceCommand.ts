import { InteractionDice } from '../item';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RollDiceCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'roll_dice', 'rd');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        const currentRoom = user.unit.room;

        if(!currentRoom) return;
        
        const positionsAround = user.unit.location.position.getPositionsAround();

        if(!positionsAround) return;
        
        const totalPositions = positionsAround.length;

        if(!totalPositions) return;
        
        for(let i = 0; i < totalPositions; i++)
        {
            const position = positionsAround[i];

            if(!position) continue;
            
            const tile = currentRoom.map.getTile(position);

            if(!tile) continue;
            
            const highestItem = tile.highestItem;

            if(!highestItem) continue;
            
            if(!highestItem.baseItem.hasInteraction(InteractionDice)) continue;
            
            const interaction = <InteractionDice> highestItem.baseItem.interaction;
            
            if(interaction.onClick) interaction.onClick(user.unit, highestItem);
        }
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Rolls all dice around you';
    }
}