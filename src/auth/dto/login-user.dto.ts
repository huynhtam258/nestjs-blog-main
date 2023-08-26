import { IsNotEmpty, IsEmail } from "class-validator"

export class LoginUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string

    password: string
} 