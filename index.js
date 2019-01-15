var fs = require('fs');

if(process.argv[2] == '--dev')
{
    console.log('Development Mode');

    require('ts-node/register');
    require('./src/main');
}
else
{
    require('./dist/main');
}