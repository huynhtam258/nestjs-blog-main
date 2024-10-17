import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ResponseRefreshToken } from './interfaces/refresh-token.interface';
import { ResponseLogin } from './interfaces/login.interface';
import { randomBytes } from 'crypto'
import { resetPasswordDto } from './dto/reset-password.dto';
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
      key: randomBytes(10).toString('hex'),
      password: hashPassword
    })
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  public async login(loginUserDto: LoginUserDto): Promise<ResponseLogin> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED)
    }

    const checkPass = bcrypt.compareSync(loginUserDto.password, user.password)

    if (!checkPass) {
      throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED)
    }

    // generate token and refresh token
    const payload = { id: user.id, email: user.email, key: user.key }
    const token = await this.generateToken(payload);
    return {
      ...token,
      client_key: user.key
    }
  }

  public async refreshToken(refresh_token: string): Promise<ResponseRefreshToken> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          refresh_token: refresh_token
        }
      })
      if (!user) {
        throw new HttpException('Refresh token is not valid', HttpStatus.UNAUTHORIZED)
      }
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: user.key
      })

      if (!verify) {
        throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
      }

      const checkExistToken = await this.userRepository.findOneBy({ email: verify.email, refresh_token })
      if (!checkExistToken) {
        throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
      }
      return this.generateToken({ id: verify.id, email: verify.email, key: user.key })

    } catch (error) {

      throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
    }
  }

  public async resetPassword (resetPasswordDto: resetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email }
    });

    if (!user) {
      throw new HttpException('Email is not exist', HttpStatus.UNAUTHORIZED)
    }

    const checkPass = bcrypt.compareSync(resetPasswordDto.password, user.password)

    if (!checkPass) {
      throw new HttpException('Password is not correct', HttpStatus.UNAUTHORIZED)
    }

    const hashPassword = await this.hashPassword(resetPasswordDto.newPassword)
    return await this.userRepository.update(user.id, {
      password: hashPassword
    })
  }

  private async generateToken(payload: { id: number, email: string, key: string }) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: payload.key,
      expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN')
    })
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: payload.key,
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
    })

    await this.userRepository.update(
      { email: payload.email },
      { refresh_token: refresh_token }
    )

    return { access_token, refresh_token }
  }
}
