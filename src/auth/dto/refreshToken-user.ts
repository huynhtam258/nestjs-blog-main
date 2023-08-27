import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshTokenUserDto {
    @IsNotEmpty()
    @ApiProperty()
    refresh_token: string
}