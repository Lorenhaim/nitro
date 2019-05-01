export function shuffleArray<T>(array: Array<T>): Array<T>
{
    let currentIndex    = array.length;
    let temporaryValue  = null;
    let randomIndex     = null;
    
    while (0 !== currentIndex)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        
        temporaryValue      = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex]  = temporaryValue;
    }
  
    return array;
}