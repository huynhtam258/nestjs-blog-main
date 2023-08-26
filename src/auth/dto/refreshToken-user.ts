import { IsNotEmpty } from 'class-validator'

export class RefreshTokenUserDto {
    @IsNotEmpty()
    refresh_token: string
}