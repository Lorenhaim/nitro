export interface Outfit
{
    id?: number;
    userId: number;
    figure: string;
    gender: 'M' | 'F';
    slotNumber: number;
}