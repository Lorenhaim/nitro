import { getManager } from 'typeorm';

import { SecurityTicketEntity } from '../../../common';

export class TicketManager
{
    constructor() {}

    public async checkTicket(ticket: string): Promise<number>
    {
        const result = await getManager().findOne(SecurityTicketEntity, {
            where: {
                ticket: ticket
            }
        })

        if(!result || !result.userId) return Promise.reject(new Error('invalid_ticket'));

        return Promise.resolve(result.userId);
    }
}