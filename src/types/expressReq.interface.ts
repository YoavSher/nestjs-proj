import { Request } from "express";
import { UserEntity } from "src/user/user.entity";

export interface ExpressReq extends Request {
    user?: UserEntity
}