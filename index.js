if(process.argv[2] == '--dev')
{
    require('ts-node/register');
    require('./src/main');
}
else
{
    require('./dist/main');
}