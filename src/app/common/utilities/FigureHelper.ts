export class FigureHelper
{
    public static validateFigure(figure: string, forbiddenClothing: number[] = [], ownedClothing: number[] = []): boolean
    {
        if(!figure) return false;

        const parts = figure.split('-');

        if(!parts) return false;

        const totalParts = parts.length;
        
        if(!totalParts) return false;

        const totalForbiddenClothing = forbiddenClothing.length;
        
        if(!totalForbiddenClothing) return true;

        for(let i = 0; i < totalForbiddenClothing; i++)
        {
            const part = parseInt(parts[i]);

            if(!part) continue;

            if(forbiddenClothing.indexOf(part) !== -1)
            {
                if(ownedClothing.indexOf(part) === -1) return false;

                continue;
            }
        }
        
        return true;
    }
}