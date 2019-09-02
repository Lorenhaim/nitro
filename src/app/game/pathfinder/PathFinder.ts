import { Nitro } from '../../Nitro';
import { Unit } from '../unit';
import { Node } from './node/Node';
import { MovePoints, Position } from './position';

export class PathFinder
{
    public static isValidStep(unit: Unit, position: Position, positionNext: Position, positionGoal: Position): boolean
    {
        if(!unit || !position || !positionNext || !positionGoal) return false;
        
        const currentRoom = unit.room;

        if(!currentRoom || !currentRoom.map) return false;

        const isGoal        = positionNext.compare(positionGoal);
        const currentTile   = currentRoom.map.getValidTile(unit, position, false);
        const nextTile      = currentRoom.map.getValidTile(unit, positionNext, isGoal);

        if(!currentTile || !nextTile) return false;

        if(Nitro.config.game.pathfinder.steps.ignoreDoorTile && nextTile.isDoor && !isGoal) return false;

        const currentHeight = currentTile.walkingHeight;
        const nextHeight    = nextTile.walkingHeight;

        const fromItem  = currentTile.highestItem;
        const toItem    = nextTile.highestItem;

        if(Math.abs(nextHeight - currentHeight) > Math.abs(Nitro.config.game.pathfinder.steps.maxWalkingHeight)) return false;

        if(Nitro.config.game.pathfinder.steps.allowDiagonals && !position.compare(positionNext))
        {
            const firstCheck    = currentRoom.map.getValidDiagonalTile(unit, new Position(positionNext.x, position.y));
            const secondCheck   = currentRoom.map.getValidDiagonalTile(unit, new Position(position.x, positionNext.y));

            if(!firstCheck && !secondCheck) return false;
        }

        if(!toItem) return true;

        if(isGoal) return toItem.isItemOpen;
        else return toItem.isItemOpen && !toItem.baseItem.canSit && !toItem.baseItem.canLay;
    }

    public static makePath(unit: Unit, position: Position): Position[]
    {
        const positions: Position[] = [];

        let node = this.calculateWalkingNode(unit, position);

        if(!node || !node.nextNode) return null;

        while(node.nextNode)
        {
            positions.push(node.position);

            node = node.nextNode;
        }

        if(!positions.length) return null;

        return positions.reverse();
    }

    private static calculateWalkingNode(unit: Unit, position: Position): Node
    {
        if(!unit || !position) return null;

        position = position.copy();

        const currentRoom = unit.room;

        if(!currentRoom) return null;

        if(!currentRoom.map.getValidTile(unit, position)) return null;
        
        const nodes: Node[]     = [];
        const nodeMap: Node[][] = [];
        const nodeGoal: Node    = new Node(position);

        let currentNode: Node       = null;
        let tempNode: Node          = null;
        let tempPosition: Position  = null;

        let cost        = 0;
        let difference  = 0;
        
        currentNode         = new Node(unit.location.position);
        currentNode.cost    = 0;

        if(!currentNode || !nodeGoal) return null;
        
        if(nodeMap[currentNode.position.x] === undefined) nodeMap[currentNode.position.x] = [];
                    
        nodeMap[currentNode.position.x][currentNode.position.y] = currentNode;
        nodes.push(currentNode);

        let walkingPoints: Position[] = [];

        if(Nitro.config.game.pathfinder.steps.allowDiagonals) walkingPoints = MovePoints.MOVE_POINTS;
        else walkingPoints = MovePoints.STANDARD_POINTS;

        const totalWalkingPoints = walkingPoints.length;

        if(!totalWalkingPoints) return null;

        while(nodes.length)
        {
            currentNode             = nodes.shift();
            currentNode.isClosed    = true;

            for(let i = 0; i < totalWalkingPoints; i++)
            {
                const walkingPoint = walkingPoints[i];

                tempPosition = currentNode.position.addPosition(walkingPoint);

                if(!this.isValidStep(unit, currentNode.position, tempPosition, nodeGoal.position)) continue;
                
                if(nodeMap[tempPosition.x] === undefined) nodeMap[tempPosition.x] = [];
                
                if(nodeMap[tempPosition.x][tempPosition.y] === undefined)
                {
                    tempNode = new Node(tempPosition);
                    nodeMap[tempPosition.x][tempPosition.y] = tempNode;
                }
                else tempNode = nodeMap[tempPosition.x][tempPosition.y];

                if(tempNode.isClosed) continue;

                difference = 0;

                if(currentNode.position.x !== tempNode.position.x) difference += 2;
                if(currentNode.position.y !== tempNode.position.y) difference += 2;
                    
                cost = currentNode.cost + difference + tempNode.position.getDistanceAround(nodeGoal.position);

                if(tempNode.isOpen) continue;

                if(cost < tempNode.cost)
                {
                    tempNode.cost       = cost;
                    tempNode.nextNode   = currentNode;
                }

                if(tempNode.position.compare(nodeGoal.position))
                {
                    tempNode.nextNode = currentNode;

                    return tempNode;
                }

                tempNode.isOpen = true;
                nodes.push(tempNode);
            }
        }

        return null;
    }
}