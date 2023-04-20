import { SearchParams } from "src/entities/search-params/search-params.entity";

export interface ResearchParamsProspectDto {
  keyword?: string;
  take: number;
  skip: number;
  cityName: string;
  primaryActivity: string;
  secondaryActivity: string;
  searchParams: SearchParams;
}