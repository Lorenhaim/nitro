export interface Friend
{
    userId: number;
    username: string;
    motto: string;
    gender: 'M' | 'F';
    figure: string;
    online: boolean;
    relation?: '0' | '1' | '2' | '3';
}