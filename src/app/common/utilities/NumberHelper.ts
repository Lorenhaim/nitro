export class NumberHelper
{
    public static generateNumber(): number
    {
        return Math.floor(Math.random() * 2147483647) + 1;
    }

    public static randomNumber(min: number, max: number): number
    {
        return Math.floor(Math.random() * ( max - min + 1)) + min;
    }
}