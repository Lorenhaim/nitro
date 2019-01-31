export interface Badge
{
    id?: number;
    userId?: number;
    badgeCode: string;
    slotNumber?: 0 | 1 | 2 | 3 | 4 | 5;
}