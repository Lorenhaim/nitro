export class PacketEncoder
{
    public static encodeInt(number: number = 0): number[]
    {
        return [
            Math.floor(+number / 16777216),
            Math.floor(+number % 16777216 / 65536),
            Math.floor(+number % 16777216 % 65536 / 256),
            +number % 16777216 % 65536 % 256
        ];
    }

    public static encodeShort(number: number = 0): number[]
    {
        return [
            Math.floor(+number / 256),
            +number % 256
        ];
    }

    public static encodeString(string: string = ''): number[]
    {
        let bytes: number[] = [];

        if(string)
        {
            const stringLength = string.length;

            if(stringLength) for(let i = 0; i < stringLength; i++) bytes.push(string.charCodeAt(i));
        }

        return bytes;
    }

    public static encodeBoolean(flag: boolean = true): number
    {
        return flag ? 1 : 0;
    }
}