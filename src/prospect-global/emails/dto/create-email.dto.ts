import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

export class CreateEmailDto {
  @ApiProperty({
    description: "Prospect de l'email",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Email",
    required: true
  })
  email: string;
}
