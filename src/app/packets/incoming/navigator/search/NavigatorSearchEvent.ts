import { Emulator } from '../../../../Emulator';
import { NavigatorListCollapsed, NavigatorListMode, NavigatorSearchAction, NavigatorSearchResult } from '../../../../game';
import { NavigatorSearchComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class NavigatorSearchEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tabName = this.packet.readString();

            if(tabName !== null)
            {
                const tab = Emulator.gameManager.navigatorManager.getTab(0, tabName);

                if(tab !== null)
                {
                    const query = this.packet.readString();

                    const results: NavigatorSearchResult[] = [];

                    if(query !== null)
                    {
                        const searchResult = new NavigatorSearchResult(tab, query, NavigatorSearchAction.NONE, {
                            collapsed: NavigatorListCollapsed.FALSE,
                            mode: NavigatorListMode.LIST
                        });

                        if(searchResult !== null)
                        {
                            await searchResult.loadResults();
                        
                            if(searchResult.rooms.length > 0) results.push(searchResult);
                        }
                    }

                    const includes = tab.includes;

                    const totalIncludes = tab.includes.length;

                    if(totalIncludes > 0)
                    {
                        for(let i = 0; i < totalIncludes; i++)
                        {
                            const include = includes[i];

                            if(include === 'myRooms')
                            {
                                const searchResult = new NavigatorSearchResult(tab, `owner:${ this.client.user.details.username }:My Rooms`, NavigatorSearchAction.NONE, {
                                    collapsed: NavigatorListCollapsed.FALSE,
                                    mode: NavigatorListMode.LIST
                                });
        
                                await searchResult.loadResults();
                                
                                if(searchResult.rooms.length > 0) results.push(searchResult);
                            }
                        }
                    }

                    await tab.loadSearchResults();

                    if(tab.searchResults.length > 0) results.push(...tab.searchResults);

                    this.client.processOutgoing(new NavigatorSearchComposer(tabName, query, ...results));
                }
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}