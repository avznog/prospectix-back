import { ApiProperty } from "@nestjs/swagger";

export class CreateAgendaLinkDto {
  @ApiProperty({
    description: "Lien du google agenda",
    required: true
  })
  link: string;
}
