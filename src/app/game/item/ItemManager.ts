import { getManager } from 'typeorm';
import { Manager } from '../../common';
import { ItemBaseDao, ItemEntity } from '../../database';
import { BaseItem } from './base';
import { Interaction, InteractionDefault, InteractionDice, InteractionExchange, InteractionGate, InteractionMultiHeight, InteractionPetJump, InteractionRoller, InteractionTeleport, InteractionVendingMachine, WiredEffectUnitTeleport, WiredTriggerEnterRoom, WiredTriggerSaysSomething, WiredTriggerStateChanged, WiredTriggerWalkOnFurni } from './interaction';
import { Item } from './Item';

export class ItemManager extends Manager
{
    private _baseItems: BaseItem[];
    private _interactions: Interaction[];

    constructor()
    {
        super('ItemManager');

        this._baseItems         = [];
        this._interactions      = [];
    }

    protected async onInit(): Promise<void>
    {
        this.loadInteractions();
        
        await this.loadBaseItems();
    }

    protected async onDispose(): Promise<void>
    {
        this._baseItems     = [];
        this._interactions  = [];
    }

    public getBaseItem(id: number): BaseItem
    {
        if(id)
        {
            const totalItems = this._baseItems.length;

            if(totalItems)
            {
                for(let i = 0; i < totalItems; i++)
                {
                    const base = this._baseItems[i];

                    if(base.id === id) return base;
                }
            }
        }

        return null;
    }

    public getInteraction(name: string): Interaction
    {
        const totalInteractions = this._interactions.length;

        if(totalInteractions)
        {
            for(let i = 0; i < totalInteractions; i++)
            {
                const interaction = this._interactions[i];

                if(interaction.name === name) return interaction;
            }
        }

        return null;
    }

    private loadInteractions(): void
    {
        this._interactions = [];
        
        this._interactions.push(new InteractionDefault());
        this._interactions.push(new InteractionExchange());
        this._interactions.push(new InteractionGate());
        this._interactions.push(new InteractionMultiHeight());
        this._interactions.push(new InteractionRoller());
        this._interactions.push(new InteractionTeleport());
        this._interactions.push(new InteractionVendingMachine());
        this._interactions.push(new InteractionDice());
        this._interactions.push(new InteractionPetJump());

        // WIRED

        // EFFECTS
        this._interactions.push(new WiredEffectUnitTeleport());

        // TRIGGERS
        this._interactions.push(new WiredTriggerSaysSomething());
        this._interactions.push(new WiredTriggerStateChanged());
        this._interactions.push(new WiredTriggerEnterRoom());
        this._interactions.push(new WiredTriggerWalkOnFurni());

        this.logger.log(`Loaded ${ this._interactions.length } interactions`);
    }

    private async loadBaseItems(): Promise<void>
    {
        this._baseItems = [];

        const results = await ItemBaseDao.loadItems();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._baseItems.push(new BaseItem(results[i]));
        }

        this.logger.log(`Loaded ${ this._baseItems.length } items`);
    }

    public async createItem(baseId: number, userId: number, extraData: string = null): Promise<Item>
    {
        if(!baseId || !userId) return null;

        if(!this.getBaseItem(baseId)) return null;
        
        const entity = new ItemEntity();

        entity.baseId       = baseId;
        entity.userId       = userId;
        entity.extraData    = extraData || null;

        await getManager().save(entity);

        return new Item(entity);
    }

    public get baseItems(): BaseItem[]
    {
        return this._baseItems;
    }
}