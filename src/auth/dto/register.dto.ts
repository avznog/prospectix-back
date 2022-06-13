import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto{
  @ApiProperty({
    description: "username LDAP du user"
  })
  username: string;

  @ApiProperty({
    description: "password LDAP du user"
  })
  password: string;
}