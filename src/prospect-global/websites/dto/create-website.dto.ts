import { ApiProperty } from '@nestjs/swagger';
import { Prospect } from 'src/prospect-global/prospects/entities/prospect.entity';

export class CreateWebsiteDto {
  @ApiProperty({
    description: "Prospect à qui appartient le site internet",
    required: true
  })
  prospect: Prospect;

  @ApiProperty({
    description: "Addresse web du site internet",
    required: true
  })
  website: string;
}
