import { NavigatorListCollapsed } from './NavigatorListCollapsed';
import { NavigatorListMode } from './NavigatorListMode';

export interface NavigatorListOptions
{
    collapsed: NavigatorListCollapsed;
    mode: NavigatorListMode;
    showHidden?: boolean;
}