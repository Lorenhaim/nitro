import { Emulator } from './app';

async function start()
{
    await Emulator.bootstrap();
}

start();