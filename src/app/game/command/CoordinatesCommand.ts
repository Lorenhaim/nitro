import { TimeHelper } from '../../common';
import { GenericAlertComposer } from '../../packets';
import { DirectionNames } from '../pathfinder';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class CoordinatesCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'coords', 'coordinates', 'location', 'position', 'pos', 'xyz');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user && user.unit)
        {
            const currentPosition   = user.unit.location.position;
            const currentTile       = user.unit.location.getCurrentTile();
            const currentItem       = currentTile.highestItem;

            let message = '';

            if(currentPosition)
            {
                message += `<b>Current Position</b>: {\r` +
                `  x => ${ currentPosition.x },\r` +
                `  y => ${ currentPosition.y },\r` +
                `  z => ${ currentPosition.z },\r` +
                `  bodyDirection => ${ DirectionNames[currentPosition.direction.toString()] } (${ currentPosition.direction }),\r` +
                `  headDirection => ${ DirectionNames[currentPosition.headDirection.toString()] } (${ currentPosition.headDirection })\r` +
                `}\r\r`;
            }

            if(currentTile)
            {
                const currentUnits = currentTile.units;

                message += `<b>Current Tile</b>: {\r` +
                `  isDoor => ${ currentTile.isDoor },\r` +
                `  canStack => ${ currentTile.canStack },\r` +
                `  canWalk => ${ currentTile.canWalk },\r` +
                `  walkingHeight => ${ currentTile.walkingHeight }\r`;

                if(currentUnits)
                {
                    const totalUnits = currentUnits.length;

                    if(totalUnits)
                    {
                        message += `\r  <b>Current Units</b>: {\r`;
                        
                        for(let i = 0; i < totalUnits; i++)
                        {
                            const unit = currentUnits[i];

                            message += `    unitId => ${ unit.id }\r`
                        }

                        message += `  }\r\r`;
                    }
                }

                message += `}\r\r`;
            }

            if(currentItem)
            {
                message += `<b>Current Item</b>: {\r` +
                `  publicName => ${ currentItem.baseItem.publicName },\r` +
                `  productName => ${ currentItem.baseItem.productName },\r` +
                `  spriteId => ${ currentItem.baseItem.spriteId },\r` +
                `  canWalk => ${ currentItem.baseItem.canWalk },\r` +
                `  canSit => ${ currentItem.baseItem.canSit },\r` +
                `  canLay => ${ currentItem.baseItem.canLay },\r` +
                `  itemCreated => ${ TimeHelper.formatDate(currentItem.timestampCreated, 'lll') }\r` +
                `}\r\r`;
            }

            if(message) user.connections.processOutgoing(new GenericAlertComposer(message));
        }
    }
}