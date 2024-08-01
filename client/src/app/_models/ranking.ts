export type Ranking = {
    userPoints: UserPoints[];
}

type UserPoints = {
    userName: string;
    points: number;
}