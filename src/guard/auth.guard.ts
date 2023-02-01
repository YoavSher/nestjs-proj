import { CanActivate, Injectable, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { ExpressReq } from "src/types/expressReq.interface";
@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<ExpressReq>()
        if (req.user) return true
        throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED)
    }
}