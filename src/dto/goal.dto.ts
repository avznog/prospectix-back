export class GoalDto {
    id: number;
    isCyclic: boolean;
    deadline: Date;
    title: string;
    description: string;
    achievementTotalSteps: number;
    currentAchievement: number;
}