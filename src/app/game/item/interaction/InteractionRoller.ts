import { OnClick, OnLeave, OnStop, ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionRoller extends InteractionDefault implements OnStop, OnLeave, OnClick, ParseExtraData
{
    constructor()
    {
        super('roller');
    }
}