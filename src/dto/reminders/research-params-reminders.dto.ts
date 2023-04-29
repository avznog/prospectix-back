export interface ResearchParamsRemindersDto {
  take?: number;
  skip: number;
  priority: number | null;
  done: number;
  keyword: string | null;
}