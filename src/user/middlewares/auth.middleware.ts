import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { verify } from 'jsonwebtoken'
import { ExpressReq } from "src/types/expressReq.interface";
import { JWT_SECRET } from '../../config'
import { UserService } from "../user.service";
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }
    async use(req: ExpressReq, _: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            next()
            return
        }
        const token = req.headers.authorization.split(' ')[1]
        try {
            const decodedToken = await verify(token, JWT_SECRET)
            const user = await this.userService.getUserById(decodedToken.id)
            req.user = user
            next()
        } catch (err) {
            req.user = null
            next()
        }
    }

}