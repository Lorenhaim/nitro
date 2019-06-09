import { Config, ConfigOptions, Emulator } from './app';

async function start(config: ConfigOptions)
{
    await Emulator.bootstrap(config);
}

start(Config);