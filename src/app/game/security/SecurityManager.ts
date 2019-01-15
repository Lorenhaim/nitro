import { Logger } from '../../common';

import { TicketManager } from './ticket';

export class SecurityManager
{
    private _ticketManager: TicketManager;

    constructor()
    {
        this._ticketManager = new TicketManager();
    }

    public async init(): Promise<boolean>
    {
        Logger.writeLine(`SecurityManager -> Loaded`);
            
        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        try
        {
            Logger.writeLine(`SecurityManager -> Disposed`);

            return true;
        }

        catch(err)
        {
            Logger.writeError(`SecurityManager Dispose Error -> ${ err.message || err }`);
        }
    }
    
    public ticketManager(): TicketManager
    {
        return this._ticketManager;
    }
}