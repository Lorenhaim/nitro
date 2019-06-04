import { UnitGender } from '../../../unit';

export interface Outfit
{
    id?: number;
    userId: number;
    figure: string;
    gender: UnitGender;
    slotNumber: number;
}