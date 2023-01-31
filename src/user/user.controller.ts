import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Req } from "@nestjs/common";
import { Request } from "express";
import { ExpressReq } from "src/types/expressReq.interface";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserLoginDto } from "./dto/userLogin.dto";
import { UserResponse } from "./types/userResponse.interface";
import { UserService } from "./user.service";
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post('users')
    @UsePipes(new ValidationPipe())
    async createUser(@Body('user') CreatUserDto: CreateUserDto): Promise<UserResponse> {
        // console.log('CreatUserDto:', CreatUserDto)
        const user = await this.userService.createUser(CreatUserDto)
        return this.userService.buildUserResponse(user)
    }
    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') credentials: UserLoginDto): Promise<UserResponse> {
        const user = await this.userService.login(credentials)
        return this.userService.buildUserResponse(user)
    }
    @Get('user')
    async getCurrUser(@Req() request: ExpressReq): Promise<UserResponse> {
        // console.log('request:', request.user)
        return this.userService.buildUserResponse(request.user)
    }
}