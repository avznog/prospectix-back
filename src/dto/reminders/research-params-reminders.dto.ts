export interface ResearchParamsRemindersDto {
  take?: number;
  skip: number;
  priority?: number;
  orderByPriority?: string;
  done: string;
  date?: string;
  oldOrNew: string;
  keyword: string;
}