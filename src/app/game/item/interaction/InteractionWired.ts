import { InteractionDefault } from './InteractionDefault';

export class InteractionWired extends InteractionDefault
{
    constructor(name: string = null)
    {
        super(name || 'wired');
    }
}