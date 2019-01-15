import * as moment from 'moment';

export class TimeHelper
{
    public static get now()
    {
        return new Date();
    }

    public static between(check: Date, against: Date, asType: moment.unitOfTime.Base): number
    {
        const result = moment.duration(moment(against).diff(check)).as(asType);

        if(result > 2147483647) return 2147483647;

        return result;
    }

    public static until(endTime: Date, asType: moment.unitOfTime.Base): number
    {
        const result = moment.duration(moment().diff(moment(endTime))).as(asType);

        if(result > 2147483647) return 2147483647;

        return result;
    }

    public static to(date: Date, asType: moment.unitOfTime.Base): number
    {
        return moment(date).get(asType);
    }

    public static isNextDay(check: Date, against: Date): boolean
    {
        return moment(check).startOf('day').isSame(moment(against).startOf('day').add(1, 'days'));
    }

    public static isToday(check: Date): boolean
    {
        return moment(check).isSame(moment(TimeHelper.now), 'd');
    }

    public static formatDate(date: Date, format: string)
    {
        return moment(date).format(format);
    }

    public static timeBetween(futureDate: Date, pastDate: Date): { years: number, months: number, days: number }
    {
        const future    = moment(futureDate);
        const past      = moment(pastDate);

        const years     = future.diff(past, 'year');
        past.add(years, 'years');

        const months    = future.diff(past, 'months');
        past.add(months, 'months');
        
        const days      = future.diff(past, 'days');

        return {
            years,
            months,
            days
        };
    }
}