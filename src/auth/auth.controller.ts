import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { RefreshTokenUserDto } from './dto/refreshToken-user';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        return this.authService.register({
            ...registerUserDto, refresh_token: ''
        })
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto: LoginUserDto): Promise<any> {
        return this.authService.login(loginUserDto)
    }

    @Post('refresh-token')
    refreshToken(@Body() refreshtTokenUserDto: RefreshTokenUserDto): Promise<any> {
        return this.authService.refreshToken(refreshtTokenUserDto.refresh_token)
    }
}
