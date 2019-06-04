import { CurrencyType } from './CurrencyType';

export interface Currency
{
    type: CurrencyType;
    amount: number;
}