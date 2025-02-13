import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  first_name: string

  @ApiProperty()
  @IsNotEmpty()
  last_name: string

  @ApiProperty()
  @IsNotEmpty()
  avatar: string
  
  @ApiProperty()
  @IsNotEmpty()
  status: number
}