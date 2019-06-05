import { shuffleArray } from '../../../common';
import { ItemBaseEntity } from '../../../database';
import { Emulator } from '../../../Emulator';
import { UnitEffect, UnitHandItem } from '../../unit';
import { Interaction, InteractionMultiHeight, InteractionRoller, InteractionType, InteractionVendingMachine } from '../interaction';
import { BaseItemType } from './BaseItemType';

export class BaseItem
{
    private _entity: ItemBaseEntity;
    private _interaction: Interaction;

    private _multiHeights: { [key: string]: number }[];
    private _vendingIds: UnitHandItem[];

    private _neutralEffects: UnitEffect[];
    private _maleEffects: UnitEffect[];
    private _femaleEffects: UnitEffect[];

    constructor(entity: ItemBaseEntity)
    {
        if(!(entity instanceof ItemBaseEntity)) throw new Error('invalid_entity');

        this._entity            = entity;
        this._interaction       = null;

        this._multiHeights      = [];
        this._vendingIds        = [];

        this._neutralEffects    = [];
        this._maleEffects       = [];
        this._femaleEffects     = [];

        this.loadInteraction();
        this.loadMultiHeights();
        this.loadVendingIds();
        this.loadEffectIds();
    }

    private loadInteraction(): void
    {
        this._interaction = null;

        const interaction = Emulator.gameManager.itemManager.getInteraction(this._entity.interaction || InteractionType.DEFAULT);

        if(!interaction)
        {
            Emulator.gameManager.itemManager.logger.warn(`Base Item: ${ this._entity.id }:${ this._entity.publicName } has an invalid interaction`);

            return;
        }
        
        this._interaction = interaction;
    }

    private loadMultiHeights(): void
    {
        this._multiHeights = [];
        
        if(this.hasInteraction(InteractionMultiHeight))
        {
            if(!this._entity.multiHeights) return;
            
            const parts = this._entity.multiHeights.split(',');

            if(!parts) return;
            
            const totalParts = parts.length;

            if(!totalParts) return;
            
            for(let i = 0; i < totalParts; i++) this._multiHeights[i.toString()] = parseFloat(parts[i]);
        }
    }

    private loadVendingIds(): void
    {
        this._vendingIds = [];

        if(this.hasInteraction(InteractionVendingMachine))
        {
            if(this._entity.vendingIds)
            {
                const parts = this._entity.vendingIds.split(',');

                if(parts)
                {
                    const totalParts = parts.length;

                    for(let i = 0; i < totalParts; i++) this._vendingIds.push(parseInt(parts[i]));
                }
            }
        }
    }

    private loadEffectIds(): void
    {
        this._neutralEffects    = [];
        this._maleEffects       = [];
        this._femaleEffects     = [];

        if(this._entity.effectIds)
        {
            const parts = this._entity.effectIds.split(',');

            if(parts)
            {
                const neutralIds: UnitEffect[]  = [];
                const maleIds: UnitEffect[]     = [];
                const femaleIds: UnitEffect[]   = [];

                const totalParts = parts.length;

                if(totalParts)
                {
                    let currentGender = null;

                    for(let i = 0; i < totalParts; i++)
                    {
                        const part = parts[i];
                        
                        if(part === 'M')
                        {
                            currentGender = 'M';

                            continue;
                        }

                        else if(part === 'F')
                        {
                            currentGender = 'F';

                            continue;
                        }

                        if(currentGender === null) neutralIds.push(parseInt(part));
                        else if(currentGender === 'M') maleIds.push(parseInt(part));
                        else if(currentGender === 'F') femaleIds.push(parseInt(part))
                    }

                    if(neutralIds.length)
                    {
                        this._neutralEffects  = neutralIds;
                    }
                    else
                    {
                        if(maleIds.length) this._maleEffects        = maleIds;
                        if(femaleIds.length) this._femaleEffects    = femaleIds;
                    }
                }
            }
        }
    }

    public currentStackHeight(extraData: string = null): number
    {
        if(!this.hasInteraction(InteractionMultiHeight)) return this.stackHeight;

        if(!this._multiHeights.length) return this.stackHeight;

        if(!extraData) return this.stackHeight;
        
        const result = this._multiHeights[extraData];

        if(!result) return this.stackHeight;

        return result;
    }

    public hasInteraction(...interactions: typeof Interaction[]): boolean
    {
        const types = [ ...interactions ];

        if(!types) return false;
        
        const totalTypes = types.length;

        if(!totalTypes) return false;
        
        for(let i = 0; i < totalTypes; i++) if(this._interaction instanceof types[i]) return true;

        return false;
    }

    // public hasInteraction(...interactions: InteractionType[]): boolean
    // {
    //     const types = [ ...interactions ];

    //     if(!types) return false;
        
    //     const totalTypes = types.length;

    //     if(!totalTypes) return false;
        
    //     for(let i = 0; i < totalTypes; i++) if(this._interaction.name === types[i]) return true;

    //     return false;
    // }

    public getRandomVending(): UnitHandItem
    {
        const totalVendingIds = this._vendingIds.length;

        if(!totalVendingIds) return null;

        return totalVendingIds > 1 ? shuffleArray(this._vendingIds)[0] : this._vendingIds[0];
    }

    public getRandomEffect(gender: 'M' | 'F' = null): UnitEffect
    {
        if(gender)
        {
            if(gender === 'M')
            {
                const totalMaleEffects = this._maleEffects.length;

                if(totalMaleEffects) return totalMaleEffects > 1 ? shuffleArray(this._maleEffects)[0] : this._maleEffects[0];
            }

            else if(gender === 'F')
            {
                const totalFemaleEffects = this._femaleEffects.length;

                if(totalFemaleEffects) return totalFemaleEffects > 1 ? shuffleArray(this._femaleEffects)[0] : this._femaleEffects[0];
            }
        }
        
        const totalNeutralEffects = this._neutralEffects.length;

        if(!totalNeutralEffects) return null;
        
        return totalNeutralEffects > 1 ? shuffleArray(this._neutralEffects)[0] : this._neutralEffects[0];
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get publicName(): string
    {
        return this._entity.publicName;
    }

    public get productName(): string
    {
        return this._entity.productName;
    }

    public get spriteId(): number
    {
        return this._entity.spriteId;
    }

    public get type(): BaseItemType
    {
        return this._entity.type;
    }

    public get width(): number
    {
        return this._entity.width;
    }

    public get length(): number
    {
        return this._entity.length;
    }

    public get stackHeight(): number
    {
        return this._entity.stackHeight === '0.000000' ? 0.001 : parseFloat(this._entity.stackHeight);
    }

    public get multiHeights(): { [key: string]: number }[]
    {
        return this._multiHeights;
    }

    public get interaction(): Interaction
    {
        return this._interaction;
    }

    public get totalStates(): number
    {
        return this._entity.totalStates || 0;
    }

    public get canToggle(): boolean
    {
        return this.totalStates > 1 && !this.hasInteraction(InteractionRoller);
    }

    public get canStack(): boolean
    {
        return this._entity.canStack === '1';
    }

    public get canWalk(): boolean
    {
        return this._entity.canWalk === '1' || this._entity.canSit === '1' || this._entity.canLay === '1';
    }

    public get canSit(): boolean
    {
        return this._entity.canSit === '1';
    }

    public get canLay(): boolean
    {
        return this._entity.canLay === '1';
    }

    public get canRecycle(): boolean
    {
        return this._entity.canRecycle === '1';
    }

    public get canTrade(): boolean
    {
        return this._entity.canTrade === '1';
    }

    public get canInventoryStack(): boolean
    {
        return this._entity.canInventoryStack === '1';
    }

    public get canSell(): boolean
    {
        return this._entity.canSell === '1';
    }

    public get vendingIds(): number[]
    {
        return this._vendingIds;
    }

    public get effectIds(): number[]
    {
        return [ ...this._neutralEffects, ...this._maleEffects, ...this._femaleEffects ];
    }

    public get hasEffect(): boolean
    {
        return this._neutralEffects.length > 0 || this._maleEffects.length > 0 || this._femaleEffects.length > 0;
    }

    public get extraData(): string
    {
        return this._entity.extraData;
    }
}