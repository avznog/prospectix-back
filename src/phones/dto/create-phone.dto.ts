import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/prospects/entities/prospect.entity';

export class CreatePhoneDto {
  @ApiProperty({
    description: "Prospect à qui le numéro appartient",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Numéro de téléphone",
    required: true
  })
  number: string;
}
