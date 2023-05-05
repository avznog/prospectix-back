export interface ResearchParamsBookmarksDto {
  take?: number;
  skip: number;
  city: string;
  zipcode: number;
  secondaryActivity: number;
  primaryActivity: number;
  keyword: string;
}