export interface ResearchParamsMeetingsDto {
  take?: number;
  skip: number;
  done: string;
  date?: string;
  oldOrNew: string;
  keyword: string;
  type?: string
}