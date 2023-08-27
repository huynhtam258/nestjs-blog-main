import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class RegisterUserDto {
    @ApiProperty()
    @IsNotEmpty()
    first_name: string

    @ApiProperty()
    @IsNotEmpty()
    last_name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsNotEmpty()
    refresh_token: string
    
    @ApiProperty()
    @IsNotEmpty()
    status: number
}