import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpException,
    Injectable
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private configService: ConfigService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const clientId = request.headers['x-client-id']
        
        
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: clientId,
            })
            
            request['user_data'] = payload;
        } catch (error) {
            throw new HttpException({
                status: 419,
                message: 'Token expired'
            }, 419)
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers['authorization']
            ? request.headers['authorization'].split(' ')
            : [];
        return type === 'Bearer' ? token : undefined;
    }
}