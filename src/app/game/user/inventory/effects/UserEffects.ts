import { getManager } from 'typeorm';
import { Manager, TimeHelper } from '../../../../common';
import { UserEffectDao, UserEffectEntity } from '../../../../database';
import { UnitEffect } from '../../../unit';
import { User } from '../../User';

export class UserEffects extends Manager
{
    private _user: User;
    private _effects: UserEffectEntity[];

    constructor(user: User)
    {
        super('UserEffects', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user      = user;
        this._effects   = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadEffects();
    }

    protected async onDispose(): Promise<void>
    {
        this._effects = [];
    }

    public getEffect(effect: UnitEffect): UserEffectEntity
    {
        if(!effect) return null;

        const totalEffects = this._effects.length;

        if(!totalEffects) return null;

        for(let i = 0; i < totalEffects; i++)
        {
            const existingEffect = this._effects[i];

            if(!existingEffect) continue;

            if(existingEffect.effectId !== effect) continue;

            return existingEffect;
        }

        return null;
    }

    public hasEffect(effect: UnitEffect): boolean
    {
        return this.getEffect(effect) !== null;
    }

    public async activeEffect(effect: UnitEffect): Promise<void>
    {
        if(!effect) return;

        const existingEffect = this.getEffect(effect);

        if(!existingEffect) return;

        existingEffect.timestampActivated = TimeHelper.now;

        await getManager().save(existingEffect);

        if(!this._user.unit || !this._user.unit.room) return;

        this._user.unit.location.effect(existingEffect.effectId);
    }

    public async enableEffect(effect: UnitEffect): Promise<void>
    {
        if(!effect) return;

        const existingEffect = this.getEffect(effect);

        if(!existingEffect) return;

        if(!existingEffect.timestampActivated) existingEffect.timestampActivated = TimeHelper.now;

        await getManager().save(existingEffect);

        if(!this._user.unit || !this._user.unit.room) return;

        this._user.unit.location.effect(existingEffect.effectId);
    }

    private async loadEffects(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._effects = [];

        const results = await UserEffectDao.loadUserEffects(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const entity = results[i];

            if(!entity) continue;

            this._effects.push(entity);
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get effects(): UserEffectEntity[]
    {
        return this._effects;
    }
}