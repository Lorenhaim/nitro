import { getManager } from 'typeorm';
import { UserCurrencyEntity } from '../../database';

export class UserCurrencyDao
{
    public static async createCurrency(userId: number, type: number, amount: number = 0): Promise<UserCurrencyEntity>
    {
        if(userId && typeof type === 'number')
        {
            const newCurrency = new UserCurrencyEntity();

            newCurrency.userId  = userId;
            newCurrency.type    = type;
            newCurrency.amount  = amount;

            await getManager().save(newCurrency);

            return newCurrency;
        }

        return null;
    }

    public static async updateCurrency(userId: number, type: number, amount: number): Promise<void>
    {
        if(userId && typeof type === 'number' && typeof amount === 'number')
        {
            await getManager().update(UserCurrencyEntity, {
                userId: userId,
                type
            }, { amount });
        }
    }

    public static async loadCurrencies(userId: number): Promise<UserCurrencyEntity[]>
    {
        if(userId)
        {
            const results = await getManager().find(UserCurrencyEntity, {
                where: { userId }
            });

            if(results) return results;
        }

        return null;
    }
}