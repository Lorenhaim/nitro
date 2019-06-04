import { getManager } from 'typeorm';
import { shuffleArray } from '../../common';
import { CatalogItemDao, CatalogItemEntity, ItemDao } from '../../database';
import { Emulator } from '../../Emulator';
import { CatalogPurchaseComposer, CatalogPurchaseFailedComposer, CatalogPurchaseUnavailableComposer, CatalogSoldOutComposer, OutgoingPacket } from '../../packets';
import { BaseItem, BaseItemType, InteractionTeleport, Item } from '../item';
import { PermissionList } from '../security';
import { CurrencyType, User } from '../user';
import { CatalogPage } from './CatalogPage';
import { CatalogPurchaseFailed } from './CatalogPurchaseFailed';
import { CatalogPurchaseUnavailable } from './CatalogPurchaseUnavailable';

export class CatalogItem
{
    private _entity: CatalogItemEntity;
    private _page: CatalogPage;

    private _baseItems: BaseItem[];

    private _availableNumbers: number[];
    private _soldNumbers: number[];

    constructor(entity: CatalogItemEntity, page: CatalogPage)
    {
        if(!(entity instanceof CatalogItemEntity) || !(page instanceof CatalogPage)) throw new Error('invalid_entity');

        this._entity            = entity;
        this._page              = page;

        this._baseItems         = [];

        this._availableNumbers  = [];
        this._soldNumbers       = [];

        this.loadBaseItems();
    }

    private loadBaseItems(): void
    {
        this._baseItems = [];

        if(!this.baseId) return;

        const baseItem = Emulator.gameManager.itemManager.getBaseItem(this.baseId);

        if(!baseItem) return;

        this._baseItems.push(baseItem);
    }

    public async generateLimitedNumbers(): Promise<void>
    {
        this._availableNumbers  = [];
        this._soldNumbers       = [];

        if(!this._entity.limitedStack) return;

        if(this._entity.limitedSells >= this._entity.limitedStack) return;
        
        const possibleNumbers: number[] = [];

        for(let i = 0; i < this._entity.limitedStack; i++) possibleNumbers.push(i + 1);

        const results = await CatalogItemDao.getLimitedSells(this._entity.id);
        
        if(results)
        {
            const totalResults = results.length;

            if(this._entity.limitedSells !== totalResults)
            {
                this._entity.limitedSells = totalResults;
                
                await getManager().save(this._entity);
            }

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    if(!result) continue;

                    const findPossibility = possibleNumbers.indexOf(result.limitedNumber);

                    if(findPossibility !== -1) possibleNumbers.splice(findPossibility, 1);

                    this._soldNumbers.push(result.limitedNumber);
                }
            }
        }

        this._availableNumbers = possibleNumbers.length > 1 ? shuffleArray(possibleNumbers) : possibleNumbers;
    }

    public async purchaseItem(user: User, amount: number = 1, extraData: string = null): Promise<void>
    {
        if(!user || !amount) return user.connections.processOutgoing(new CatalogPurchaseUnavailableComposer(CatalogPurchaseUnavailable.ILLEGAL));

        if(!this._page.isVisible && !user.hasPermission(PermissionList.CATALOG_VIEW_HIDDEN) || this._page.minRank && this._page.minRank > user.details.rankId || !this.hasOffer && amount > 1) return user.connections.processOutgoing(new CatalogPurchaseUnavailableComposer(CatalogPurchaseUnavailable.ILLEGAL));

        if(this.clubOnly && !user.details.clubActive) return user.connections.processOutgoing(new CatalogPurchaseUnavailableComposer(CatalogPurchaseUnavailable.HABBO_CLUB));

        if(this.isLimited && this.limitedRemaining === 0) return user.connections.processOutgoing(new CatalogSoldOutComposer());

        let totalCostCredits    = this.costCredits || 0 * amount;
        let totalCostCurrency   = this.costCurrency || 0 * amount;

        if(totalCostCredits)
        {
            const currentCredits = user.inventory.currency.getCurrency(CurrencyType.CREDITS);

            if(!currentCredits || currentCredits.amount < totalCostCredits) return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));

            if(!await user.inventory.currency.modifyCurrency(CurrencyType.CREDITS, -totalCostCredits)) return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));
        }

        if(totalCostCurrency)
        {
            const currentCurrency = user.inventory.currency.getCurrency(this.costCurrencyType);

            if(!currentCurrency || currentCurrency.amount < totalCostCurrency) return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));

            if(!await user.inventory.currency.modifyCurrency(this.costCurrencyType, -totalCostCurrency))
            {
                if(totalCostCredits) await user.inventory.currency.modifyCurrency(CurrencyType.CREDITS, totalCostCredits);

                return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));
            }
        }

        if(this.isLimited) return this.purchaseLimitedItem(user);

        const newItems: Item[] = [];

        const totalBaseItems = this._baseItems.length;

        if(!totalBaseItems) return;

        for(let i = 0; i < totalBaseItems; i++)
        {
            const baseItem = this._baseItems[i];

            if(!baseItem) continue;

            for(let j = 0; j < amount; j++)
            {
                if(baseItem.hasInteraction(InteractionTeleport))
                {
                    const teleportOne = await Emulator.gameManager.itemManager.createItem(baseItem.id, user.id, extraData);
                    const teleportTwo = await Emulator.gameManager.itemManager.createItem(baseItem.id, user.id, extraData);

                    if(!teleportOne || !teleportTwo) continue;

                    await ItemDao.addTeleportLink(teleportOne.id, teleportTwo.id);

                    newItems.push(teleportOne, teleportTwo)
                }
                else
                {
                    const item = await Emulator.gameManager.itemManager.createItem(baseItem.id, user.id, extraData);

                    if(!item) continue;

                    newItems.push(item);
                }
            }
        }

        if(newItems.length)
        {
            user.inventory.items.addItem(...newItems);

            user.connections.processOutgoing(new CatalogPurchaseComposer(this));
        }
    }

    private async purchaseLimitedItem(user: User): Promise<void>
    {
        if(!user) return;

        if(!this._entity.limitedStack) return;

        if(this._entity.limitedSells >= this._entity.limitedStack) return user.connections.processOutgoing(new CatalogSoldOutComposer());
        
        const limitedNumber = this._availableNumbers[0];

        const findPossibility = this._availableNumbers.indexOf(limitedNumber);
        const soldPossibility = this._soldNumbers.indexOf(limitedNumber);

        if(findPossibility === -1 || soldPossibility !== -1) return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));

        this._availableNumbers.splice(findPossibility, 1);
        this._soldNumbers.push(limitedNumber);

        const newItem = await Emulator.gameManager.itemManager.createItem(this._entity.baseId, user.id, this._entity.extraData);

        if(!newItem)
        {
            this._availableNumbers.push(limitedNumber);

            const soldPossibility = this._soldNumbers.indexOf(limitedNumber);

            if(soldPossibility !== -1) this._soldNumbers.splice(soldPossibility, 1);

            return user.connections.processOutgoing(new CatalogPurchaseFailedComposer(CatalogPurchaseFailed.ERROR));
        }

        this._entity.limitedSells = this._entity.limitedSells + 1;

        await getManager().save(this._entity);
        
        newItem.limitedData = `${ limitedNumber }:${ this._entity.limitedStack }`;

        newItem.save();
            
        await CatalogItemDao.addLimitedPurchase(user.id, this._entity.baseId, this._entity.id, newItem.id, limitedNumber);

        user.inventory.items.addItem(newItem);
        
        user.connections.processOutgoing(new CatalogPurchaseComposer(this));
    }

    public parseItem(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return;

        packet
            .writeInt(this._entity.id)
            .writeString(this._entity.productName)
            .writeBoolean(false)
            .writeInt(this._entity.costCredits, this._entity.costCurrency, this._entity.costCurrencyType)
            .writeBoolean(false); // can gift

        const totalBaseItems = this._baseItems.length;

        if(totalBaseItems)
        {
            packet.writeInt(totalBaseItems);

            for(let i = 0; i < totalBaseItems; i++)
            {
                const baseItem = this._baseItems[i];

                packet.writeString(baseItem.type.toLowerCase());

                if(baseItem.type === BaseItemType.BADGE)
                {
                    packet.writeString(this._entity.productName);
                }
                else
                {
                    packet.writeInt(baseItem.spriteId);

                    if(baseItem.type === BaseItemType.ROBOT)
                    {
                        packet.writeString(this._entity.extraData);
                    }

                    else if(baseItem.productName === 'landscape' || baseItem.productName === 'wallpaper' || baseItem.productName === 'floor')
                    {
                        packet.writeString(this._entity.productName.split('_')[2]);
                    }

                    else if(baseItem.productName === 'poster')
                    {
                        packet.writeString(this._entity.extraData);
                    }

                    else if(baseItem.productName.startsWith('sound_set_'))
                    {
                        packet.writeString(this._entity.extraData);
                    }

                    else packet.writeString(null);

                    packet.writeInt(1);
                    packet.writeBoolean(this.isLimited);

                    if(this.isLimited) packet.writeInt(this._entity.limitedStack, this.limitedRemaining);
                }
            }
        }
        else packet.writeInt(0);
        
        return packet
            .writeInt(this._entity.clubOnly === '1' ? 1 : 0)
            .writeBoolean(this.hasOffer)
            .writeBoolean(false)
            .writeString(`${ this._baseItems[0].productName }.png`);
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get pageId(): number
    {
        return this._entity.pageId;
    }

    public get page(): CatalogPage
    {
        return this._page;
    }

    public get baseId(): number
    {
        return this._entity.baseId;
    }

    public get productName(): string
    {
        return this._entity.productName;
    }

    public get offerId(): number
    {
        return this._entity.offerId;
    }

    public get costCredits(): number
    {
        return this._entity.costCredits;
    }

    public get costCurrency(): number
    {
        return this._entity.costCurrency;
    }

    public get costCurrencyType(): CurrencyType
    {
        return this._entity.costCurrencyType;
    }

    public get amount(): number
    {
        return this._entity.amount;
    }

    public get limitedSells(): number
    {
        return this._entity.limitedSells;
    }

    public get limitedStack(): number
    {
        return this._entity.limitedStack;
    }

    public get limitedRemaining(): number
    {
        return this._entity.limitedStack - this._entity.limitedSells;
    }

    public get isLimited(): boolean
    {
        return this._entity.limitedStack > 0;
    }

    public get hasOffer(): boolean
    {
        if(this._entity.limitedStack > 0) return false;

        return this._entity.hasOffer === '1';
    }

    public get clubOnly(): boolean
    {
        return this._entity.clubOnly === '1';
    }

    public get extraData(): string
    {
        return this._entity.extraData;
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }
}