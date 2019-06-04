import { InteractionDice } from '../item';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RollDiceCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'rd', 'rolldice');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            const room = user.unit.room;

            if(room)
            {
                const positionsAround = user.unit.location.position.getPositionsAround();

                if(positionsAround)
                {
                    const totalPositions = positionsAround.length;

                    if(totalPositions)
                    {
                        for(let i = 0; i < totalPositions; i++)
                        {
                            const position = positionsAround[i];

                            if(position)
                            {
                                const tile = room.map.getTile(position);

                                if(tile)
                                {
                                    const highestItem = tile.highestItem;

                                    if(highestItem)
                                    {
                                        if(highestItem.baseItem.hasInteraction(InteractionDice))
                                        {
                                            const interaction: any = highestItem.baseItem.interaction;
                                            
                                            if(interaction && interaction.onClick) interaction.onClick(user.unit, highestItem);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public get description(): string
    {
        return 'Rolls all dice around you';
    }
}