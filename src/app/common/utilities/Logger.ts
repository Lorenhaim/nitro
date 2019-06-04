import * as clc from 'cli-color';
import * as moment from 'moment';

export class Logger
{
    private _context: string;
    private _contextInstance: string;

    private _printLogger: boolean;
    private static _lastTimestamp: number = Date.now();
    
    constructor(context?: string, contextInstance?: string)
    {
        this._context           = context || null;
        this._contextInstance   = contextInstance || null;

        this._printLogger = true;
    }
    
    public log(message: any): void
    {
        this.printMessage(message, clc.green);
    }
    
    public error(message: any, trace?: any): void
    {
        this.printMessage(trace || message, clc.red);

        // appendFile('./errors.txt', message, function (err) {
        //     if (err) throw err;
        //   });
    }
    
    public warn(message: any): void
    {
        this.printMessage(message, clc.yellow);
    }
    
    public printMessage(message: any, color?: clc.Format): void
    {
        if(this._printLogger)
        {
            process.stdout.write(` ${ color(`[Nitro]`) } ${ moment().format('M/D/YY h:mm:ss A') } `);
            this._context && process.stdout.write(clc.cyan(`[${ this._context }] `));
            this._contextInstance && process.stdout.write(clc.blackBright(`[${ this._contextInstance }] `));
            process.stdout.write(color(message));
            
            this.printTimestamp();
            process.stdout.write(`\n`);
        }
    }
  
    private printTimestamp()
    {
        const now = Date.now();

        process.stdout.write(clc.blackBright(` +${ now - Logger._lastTimestamp || 0 }ms`));
        
        Logger._lastTimestamp = now;
    }

    public set contextInstance(value: any)
    {
        this._contextInstance = value;
    }

    public set printLogger(value: boolean)
    {
        this._printLogger = value;
    }
}