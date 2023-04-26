import { SearchParams } from "src/entities/search-params/search-params.entity";

export interface ResearchParamsProspectDto {
  keyword?: string;
  take: number;
  skip: number;
  city: number;
  primaryActivity: number;
  secondaryActivity: number;
  searchParams: SearchParams;
}