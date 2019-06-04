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
        this._results   = [ ...searchResults ];
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeString(this._tab)
            .writeString(this._query);
            
        if(this._results)
        {
            const totalResults = this._results.length;

            if(!totalResults) return this.packet.writeInt(0).prepare();

            this.packet.writeInt(totalResults);
            
            for(let i = 0; i < totalResults; i++) this._results[i].parseResult(this.packet);
        }
        else this.packet.writeInt(0);
        
        return this.packet.prepare();
    }
}