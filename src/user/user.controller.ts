import { Controller, Post, Body, UsePipes, ValidationPipe, Get, UseGuards, Put } from "@nestjs/common";
import { AuthGuard } from "src/guard/auth.guard";
import { User } from "./decorators/user.decorator";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UserLoginDto } from "./dto/userLogin.dto";
import { UserResponse } from "./types/userResponse.interface";
import { UserEntity } from "./user.entity";
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
    @UseGuards(AuthGuard)
    async getCurrUser(@User() user: UserEntity): Promise<UserResponse> {
        // console.log('user:', user)
        return this.userService.buildUserResponse(user)
    }
    @Put('user')
    @UseGuards(AuthGuard)
    async updateUser(@Body('user') updatedInfo: UpdateUserDto, @User('id') id: number)
        : Promise<UserResponse> {
        // console.log('user:', user)
        const updatedUser = await this.userService.updateUser(id, updatedInfo)
        return this.userService.buildUserResponse(updatedUser)
    }
}