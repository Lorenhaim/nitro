import { Emulator } from './app';

async function start()
{
    console.log();
    console.log(`       _   ___ __              `);
    console.log(`      / | / (_) /__________    `);
    console.log(`     /  |/ / / __/ ___/ __ \\  `);
    console.log(`    / /|  / / /_/ /  / /_/ /   `);
    console.log(`   /_/ |_/_/\\__/_/   \\____/  `);
    console.log(`   v0.0.1 by Billsonnn         `);
    console.log();

    await Emulator.bootstrap();
}

start();