import { ApiProperty } from '@nestjs/swagger';

export class CreatePhoneDto {
  @ApiProperty({
    description: "Numéro de téléphone",
    required: true
  })
  number: string;
}
