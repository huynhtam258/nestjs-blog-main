import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }
    public async register(registerUserDto: RegisterUserDto): Promise<User> {
        const hashPassword = await this.hashPassword(registerUserDto.password)
        return await this.userRepository.save({
            ...registerUserDto,
            password: hashPassword
        })
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    public async login(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email }
        });

        if (!user) {
            throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED)
        }

        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password)

        if(!checkPass) {
            throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED)
        }

        // generate token and refresh token
        const payload = { id: user.id, email: user.email }
        const token = await this.generateToken(payload);
        return token
    }

    public async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET')
            })
            
            if(!verify) {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
            }

            const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token})
            if (!checkExistToken) {
                throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST) 
            }
            return this.generateToken({ id: verify.id, email: verify.email})

        } catch (error) {
            
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
        } 
    }

    private async generateToken(payload: {id: number, email: string}) {
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN')
        })
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
        })

        await this.userRepository.update(
            { email: payload.email },
            { refresh_token: refresh_token }
        )

        return { access_token, refresh_token }
    }
}
