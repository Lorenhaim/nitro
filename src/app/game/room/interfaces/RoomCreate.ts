import { RoomTradeType } from './RoomTradeType';

export interface RoomCreate
{
    name: string;
    description?: string;
    modelName: string;
    categoryId?: number;
    usersMax: number;
    tradeType: RoomTradeType;
}