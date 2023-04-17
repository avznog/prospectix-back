export interface ResearchParamsProspectDto {
  keyword?: string;
  take: number;
  skip: number;
  cityName: string;
  primaryActivity: string;
  secondaryActivity: string;
}