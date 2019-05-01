import { Emulator } from '../../Emulator';
import { Unit } from '../unit';
import { PathFinderNode } from './PathFinderNode';
import { movePoints, Position, standardPoints } from './position';

export class PathFinder
{
    public static isValidStep(unit: Unit, position: Position, positionNext: Position, positionGoal: Position): boolean
    {
        if(unit && position && positionNext && positionGoal)
        {
            const currentRoom = unit.room;

            if(currentRoom)
            {
                const currentTile   = currentRoom.map.getValidTile(unit, position);
                const nextTile      = currentRoom.map.getValidTile(unit, positionNext);
                const isGoal        = positionNext.compare(positionGoal);

                if(currentTile && nextTile)
                {
                    if(Emulator.config.game.pathfinder.steps.ignoreDoorTile && nextTile.isDoor && !isGoal) return false;

                    const currentHeight = currentTile.walkingHeight;
                    const nextHeight    = nextTile.walkingHeight;

                    const fromItem  = currentTile.highestItem;
                    const toItem    = nextTile.highestItem;

                    if(nextHeight > currentHeight + Emulator.config.game.pathfinder.steps.maxWalkingHeight) return false;

                    if(Emulator.config.game.pathfinder.steps.allowDiagonals && !position.compare(positionNext))
                    {
                        const firstCheck    = currentRoom.map.getValidDiagonalTile(unit, new Position(positionNext.x, position.y));
                        const secondCheck   = currentRoom.map.getValidDiagonalTile(unit, new Position(position.x, positionNext.y));

                        if(!firstCheck && !secondCheck) return false;
                    }

                    if(toItem)
                    {
                        if(isGoal)
                        {
                            if(toItem.baseItem.canSit || toItem.baseItem.canLay) return true;

                            if(Emulator.config.game.pathfinder.steps.checkItemBelow)
                            {
                                if(toItem.itemBelow)
                                {
                                    if(!toItem.itemBelow.baseItem.canWalk)
                                    {
                                        if(toItem.position.z >= toItem.itemBelow.position.z + (toItem.itemBelow.baseItem.stackHeight * 2) && toItem.baseItem.canWalk || toItem.isItemOpen) return true;

                                        return false;
                                    }

                                    return true;
                                }
                            }
                            
                            return toItem.baseItem.canWalk || toItem.isItemOpen;
                        }
                        else
                        {
                            if(toItem.baseItem.canSit || toItem.baseItem.canLay) return false;

                            if(Emulator.config.game.pathfinder.steps.checkItemBelow)
                            {
                                if(toItem.itemBelow)
                                {
                                    if(toItem.itemBelow.baseItem.canSit || toItem.itemBelow.baseItem.canLay) return false;

                                    if(!toItem.itemBelow.baseItem.canWalk)
                                    {
                                        if(toItem.position.z >= toItem.itemBelow.position.z + (toItem.itemBelow.baseItem.stackHeight * 2) && toItem.baseItem.canWalk || toItem.isItemOpen && !toItem.baseItem.canSit && !toItem.baseItem.canLay) return true;

                                        return false;
                                    }
                                }
                            }

                            return toItem.baseItem.canWalk || toItem.isItemOpen && !toItem.baseItem.canSit && !toItem.baseItem.canLay;
                        }
                    }

                    return true;
                }
            }
        }

        return false;
    }

    public static makePath(unit: Unit, position: Position): Position[]
    {
        const positions: Position[] = [];

        let node = this.calculateWalkingNode(unit, position);

        if(node)
        {
            do
            {
                if(node.nextNode)
                {
                    positions.push(node.position);
                    node = node.nextNode;
                }
                else
                {
                    node = null;
                }
            }
            while(node);
        }

        return positions.reverse();
    }

    private static calculateWalkingNode(unit: Unit, position: Position): PathFinderNode
    {
        const nodes: PathFinderNode[]       = [];
        const nodeMap: PathFinderNode[][]   = [];

        let currentNode: PathFinderNode = null;
        let goalNode: PathFinderNode    = null;
        let tempNode: PathFinderNode    = null;
        let tempPosition: Position      = null;

        let cost        = 0;
        let difference  = 0;

        if(unit && position)
        {
            const currentRoom = unit.room;

            if(currentRoom && currentRoom.map.getValidTile(unit, position))
            {
                currentNode         = new PathFinderNode(unit.location.position);
                currentNode.cost    = 0;

                goalNode = new PathFinderNode(position);

                if(currentNode && goalNode)
                {
                    if(nodeMap[currentNode.position.x] === undefined) nodeMap[currentNode.position.x] = [];
                    
                    nodeMap[currentNode.position.x][currentNode.position.y] = currentNode;
                    nodes.push(currentNode);

                    let walkingPoints: Position[] = [];

                    if(Emulator.config.game.pathfinder.steps.allowDiagonals) walkingPoints = movePoints;
                    else walkingPoints = standardPoints;

                    const totalWalkingPoints = walkingPoints.length;

                    while(nodes.length)
                    {
                        currentNode             = nodes.shift();
                        currentNode.isClosed    = true;

                        for(let i = 0; i < totalWalkingPoints; i++)
                        {
                            const walkingPoint = walkingPoints[i];

                            tempPosition = currentNode.position.addPosition(walkingPoint);

                            if(this.isValidStep(unit, currentNode.position, tempPosition, goalNode.position))
                            {
                                if(nodeMap[tempPosition.x] === undefined) nodeMap[tempPosition.x] = [];

                                if(nodeMap[tempPosition.x][tempPosition.y] === undefined)
                                {
                                    tempNode = new PathFinderNode(tempPosition);
                                    nodeMap[tempPosition.x][tempPosition.y] = tempNode;
                                }
                                else
                                {
                                    tempNode = nodeMap[tempPosition.x][tempPosition.y];
                                }

                                if(!tempNode.isClosed)
                                {
                                    difference = 0;

                                    if(currentNode.position.x !== tempNode.position.x) difference += 2;
                                    if(currentNode.position.y !== tempNode.position.y) difference += 2;
                                    
                                    cost = currentNode.cost + difference + tempNode.position.getDistanceAround(goalNode.position);

                                    if(!tempNode.isOpen)
                                    {
                                        if(cost < tempNode.cost)
                                        {
                                            tempNode.cost       = cost;
                                            tempNode.nextNode   = currentNode;
                                        }

                                        if(tempNode.position.compare(goalNode.position))
                                        {
                                            tempNode.nextNode = currentNode;

                                            return tempNode;
                                        }

                                        tempNode.isOpen = true;
                                        nodes.push(tempNode);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return null;
    }
}