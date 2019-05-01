import { UserCurrencyDao } from '../../../../database';
import { CurrencyComposer, CurrencyCreditsComposer } from '../../../../packets';
import { User } from '../../User';
import { Currency } from './Currency';
import { CurrencyType } from './CurrencyType';

export class UserCurrency
{
    private _user: User;
    private _currencies: Currency[];

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isPending: boolean;
    private _isSaving: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        this._currencies    = [];

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading)
        {
            this._isLoading = true;

            await this.loadCurrencies();

            this._isLoaded  = true;
            this._isLoading = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            this._currencies = [];

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
    }

    public getCurrency(type: CurrencyType): Currency
    {
        const totalCurrencies = this._currencies.length;

        if(totalCurrencies)
        {
            for(let i = 0; i < totalCurrencies; i++)
            {
                const currency = this._currencies[i];

                if(currency.type === type) return currency;
            }
        }

        return null;
    }

    private async loadCurrencies(): Promise<void>
    {
        this._currencies = [];

        const results = await UserCurrencyDao.loadCurrencies(this._user.id);

        if(results !== null)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    this._currencies.push({
                        type: result.type,
                        amount: result.amount
                    });
                }
            }
        }
    }

    public async modifyCurrency(type: CurrencyType, amount: number): Promise<boolean>
    {
        if(typeof type === 'number' && amount)
        {
            const totalCurrencies = this._currencies.length;

            if(totalCurrencies)
            {
                for(let i = 0; i < totalCurrencies; i++)
                {
                    const currency = this._currencies[i];

                    if(currency.type === type)
                    {
                        const newAmount = currency.amount + parseInt(<any> amount);

                        if(newAmount < 0) return false;

                        await UserCurrencyDao.updateCurrency(this._user.id, type, newAmount);

                        this._currencies[i].amount = newAmount;

                        if(type === -1) await this._user.connections.processOutgoing(new CurrencyCreditsComposer());
                        else await this._user.connections.processOutgoing(new CurrencyComposer());

                        return true;
                    }
                }

                const newCurrency = await UserCurrencyDao.createCurrency(this._user.id, type, amount > 0 ? amount : 0);

                if(newCurrency)
                {
                    this._currencies.push({
                        type: newCurrency.type,
                        amount: newCurrency.amount
                    });

                    if(amount > 0)
                    {
                        if(type === -1) await this._user.connections.processOutgoing(new CurrencyCreditsComposer());
                        else await this._user.connections.processOutgoing(new CurrencyComposer());
                        
                        return true;
                    }
                }
            }
        }

        return false;
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