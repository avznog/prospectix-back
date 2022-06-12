import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectManagerDto {
  @ApiProperty()
  pseudo: string;
  
  @ApiProperty()
  admin: boolean;

}
