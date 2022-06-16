import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto{
  @ApiProperty({
    description: "username LDAP du user",
    required: true
  })
  username: string;

  @ApiProperty({
    description: "password LDAP du user",
    required: true
  })
  password: string;
}