import { ApiProperty } from "@nestjs/swagger";

export class LoginPmDto {
  @ApiProperty({
    description: "Username de l'utilisateur qui veut se log",
    required: true
  })
  username: string;

  @ApiProperty({
    description: "Password de l'utilisateur qui veut se log",
    required: true
  })
  password: string;
}