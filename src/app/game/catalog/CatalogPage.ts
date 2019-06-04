import { CatalogPageEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { OutgoingPacket } from '../../packets';
import { CatalogItem } from './CatalogItem';
import { CatalogLayout } from './layouts';

export class CatalogPage
{
    private _entity: CatalogPageEntity;

    private _layout: CatalogLayout;
    private _offerIds: number[];

    constructor(entity: CatalogPageEntity)
    {
        if(!(entity instanceof CatalogPageEntity)) throw new Error('invalid_entity');

        this._entity    = entity;
        this._offerIds  = [];

        if(!this._entity.layout) throw new Error('invalid_layout');

        const layout = Emulator.gameManager.catalogManager.getLayout(this._entity.layout);

        if(!layout) throw new Error('invalid_layout');

        this._layout = layout;
    }

    public getItems(): CatalogItem[]
    {
        return Emulator.gameManager.catalogManager.getItems(this._entity.id);
    }

    public parsePage(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return null;
        
        return this._layout.parsePage(this, packet);
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get parentId(): number
    {
        return this._entity.parentId;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get caption(): string
    {
        return this._entity.caption;
    }

    public get layout(): CatalogLayout
    {
        return this._layout;
    }

    public get offerIds(): number[]
    {
        return this._offerIds;
    }

    public get imageHeader(): string
    {
        return this._entity.imageHeader;
    }

    public get imageTeaser(): string
    {
        return this._entity.imageTeaser;
    }

    public get imageSpecial(): string
    {
        return this._entity.imageSpecial;
    }

    public get textHeader(): string
    {
        return this._entity.textHeader;
    }

    public get textDetails(): string
    {
        return this._entity.textDetails;
    }

    public get textTeaser(): string
    {
        return this._entity.textTeaser;
    }

    public get minRank(): number
    {
        return this._entity.minRank;
    }

    public get isVisible(): boolean
    {
        return this._entity.isVisible === '1';
    }

    public get iconImage(): number
    {
        return this._entity.iconImage || 0;
    }
}