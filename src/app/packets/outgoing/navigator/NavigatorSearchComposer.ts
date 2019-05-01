import { Emulator } from '../../../Emulator';
import { NavigatorSearchResult } from '../../../game/navigator/search';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSearchComposer extends Outgoing
{
    private _tab: string;
    private _query: string;
    private _results: NavigatorSearchResult[];

    constructor(tab: string, query: string, ...searchResults: NavigatorSearchResult[])
    {
        super(OutgoingHeader.NAVIGATOR_SEARCH);

        this._tab       = tab || null;
        this._query     = query || null;
        this._results   = null;

        if(searchResults)
        {
            let someResults = [];
            this._results = someResults.concat(searchResults);
        }
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
            {
                this.packet
                    .writeString(this._tab)
                    .writeString(this._query);

                if(this._results)
                {
                    const totalResults = this._results.length;

                    this.packet.writeInt(totalResults);

                    if(totalResults) for(let i = 0; i < totalResults; i++) this.packet.writeBytes(...this._results[i].parseBytes());
                }
                else
                {
                    this.packet.writeInt(0);
                }

                return this.packet.prepare();
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}