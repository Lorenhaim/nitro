import { Manager } from '../../../../common';
import { UserCurrencyDao } from '../../../../database';
import { UserCreditsComposer, UserCurrencyComposer } from '../../../../packets';
import { User } from '../../User';
import { Currency } from './Currency';
import { CurrencyType } from './CurrencyType';

export class UserCurrency extends Manager
{
    private _user: User;
    private _currencies: Currency[];

    constructor(user: User)
    {
        super('UserCurrency', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        this._currencies    = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadCurrencies();
    }

    protected async onDispose(): Promise<void>
    {
        this._currencies = [];
    }

    public getCurrency(type: CurrencyType): Currency
    {
        const totalCurrencies = this._currencies.length;

        if(!totalCurrencies) return null;
        
        for(let i = 0; i < totalCurrencies; i++)
        {
            const currency = this._currencies[i];

            if(currency.type === type) return currency;
        }

        return null;
    }

    public getAllCurrencies(ignore: CurrencyType): Currency[]
    {
        const totalCurrencies = this._currencies.length;

        if(!totalCurrencies) return null;

        const results: Currency[] = [];
        
        for(let i = 0; i < totalCurrencies; i++)
        {
            const currency = this._currencies[i];

            if(currency.type === ignore) continue;

            results.push(currency);
        }

        if(results.length) return results;

        return null;
    }

    public hasCurrency(type: CurrencyType): boolean
    {
        return this.getCurrency(type) !== null;
    }

    private async createCurrency(type: CurrencyType): Promise<Currency>
    {
        if(type === null) return;

        if(this.hasCurrency(type)) return;

        const newCurrency = await UserCurrencyDao.createCurrency(this._user.id, type, 0);

        if(!newCurrency) return;

        const currency: Currency = {
            type: newCurrency.type,
            amount: newCurrency.amount
        };
        
        this._currencies.push(currency);

        if(type === -1) this._user.connections.processOutgoing(new UserCreditsComposer());
        else this._user.connections.processOutgoing(new UserCurrencyComposer());

        return currency;
    }

    public async modifyCurrency(type: CurrencyType, amount: number): Promise<boolean>
    {
        if(type === null || !amount) return;

        const totalCurrencies = this._currencies.length;

        if(!totalCurrencies) return false;
        
        for(let i = 0; i < totalCurrencies; i++)
        {
            const currency = this._currencies[i];

            if(currency.type === type)
            {
                const newAmount = currency.amount + amount;

                if(newAmount < 0) return false;

                await UserCurrencyDao.updateCurrency(this._user.id, type, newAmount);

                currency.amount = newAmount;

                if(type === -1) this._user.connections.processOutgoing(new UserCreditsComposer());
                else this._user.connections.processOutgoing(new UserCurrencyComposer());

                return true;
            }
        }

        const currency = await this.createCurrency(type);

        if(!currency) return false;

        return await this.modifyCurrency(type, amount);
    }

    private async loadCurrencies(): Promise<void>
    {
        this._currencies = [];

        const results = await UserCurrencyDao.loadCurrencies(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._currencies.push({
                type: result.type,
                amount: result.amount
            });
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get currencies(): Currency[]
    {
        return this._currencies;
    }
}