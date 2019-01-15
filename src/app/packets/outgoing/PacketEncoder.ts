export class PacketEncoder
{
    public static encodeInt(number: number = 0): [number, number, number, number]
    {
        return [
            Math.floor(+number / 16777216),
            Math.floor(+number % 16777216 / 65536),
            Math.floor(+number % 16777216 % 65536 / 256),
            +number % 16777216 % 65536 % 256
        ];
    }

    public static encodeShort(number: number = 0): [number, number]
    {
        return [
            Math.floor(+number / 256),
            +number % 256
        ];
    }

    public static encodeString(string: string = ""): any[]
    {
        if(string.length === 0) return [];

        let bytes = [];

        for(let i = 0; i < string.length; ++i)
        {
            let byte = string.charCodeAt(i);

            bytes = bytes.concat([byte]);
        }

        return bytes;
    }

    public static encodeBoolean(flag: boolean = true): number
    {
        return flag ? 1 : 0;
    }
}