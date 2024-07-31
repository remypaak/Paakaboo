export type ThemeResponse = {
    id: number;
    name: string;
    weekNumber: number;
    exampleUrl: string;
    examplePublicId: string;
    startDate: Date;
    submitEndDate: Date;
    voteEndDate: Date;
    trophyEndDate: Date;
    winner?: Winner;
}

export type Winner = {
    name: string;
    photoUrl: string
    totalScore: number;
}