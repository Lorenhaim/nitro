import { BadgeSlot } from './BadgeSlot';

export interface Badge
{
    id?: number;
    userId?: number;
    badgeCode: string;
    slotNumber?: BadgeSlot;
}