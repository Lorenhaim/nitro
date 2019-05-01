import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';

export abstract class CatalogLayout
{
    private _name: string;

    constructor(name: string)
    {
        if(!name) throw new Error('invalid_catalog_layout');

        this._name = name;
    }

    public abstract parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket;

    public get name(): string
    {
        return this._name;
    }
}