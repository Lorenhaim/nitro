import { NitroPlugin } from './NitroPlugin';

export interface PluginConfig
{
    name: string;
    mainClass: typeof NitroPlugin;
}