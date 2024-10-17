import { IsNotEmpty, IsEmail } from "class-validator"
import { ApiProperty } from '@nestjs/swagger'
export class resetPasswordDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsNotEmpty()
    password: string

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string
} 