import { PartialType } from "@nestjs/swagger";
import { CreateSearchParamsDto } from "./create-search-params.dto";

export class UpdateSearchParamsDto extends PartialType(CreateSearchParamsDto) {}