import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { compare } from 'bcrypt'
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { sign } from 'jsonwebtoken'
import { JWT_SECRET } from "src/config";
import { UserResponse } from "./types/userResponse.interface";
import { UserLoginDto } from "./dto/userLogin.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>) { }
    genereateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, JWT_SECRET)
    }
    buildUserResponse(user: UserEntity): UserResponse {
        return {
            user: {
                ...user,
                token: this.genereateJwt(user)
            }
        }
    }
    async createUser(createdUser: CreateUserDto): Promise<UserEntity> {
        const userEmail = await this.userRepository.findOne({ where: { email: createdUser.email } })
        const userName = await this.userRepository.findOne({ where: { username: createdUser.username } })
        if (userEmail || userName) {
            throw new HttpException('username or email is already taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity()
        Object.assign(newUser, createdUser)
        // console.log('newUser:', newUser)
        return await this.userRepository.save(newUser)
    }
    async login({ email, password }: UserLoginDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { email: email },
            select: ['id', 'bio', 'email', 'image', 'username', 'password']
        })
        console.log('user:', user)
        if (!user) {
            throw new HttpException('incorrect email', HttpStatus.NOT_ACCEPTABLE)
        }
        const match = await compare(password, user.password)
        if (!match) {
            throw new HttpException('incorrect password', HttpStatus.NOT_ACCEPTABLE)
        }
        delete user.password
        return user
    }
    async getUserById(userId: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        return user
    }
    async updateUser(userId: number, updatedInfo: UpdateUserDto): Promise<UserEntity> {
        const user = await this.getUserById(userId)
        Object.assign(user, updatedInfo)
        return await this.userRepository.save(user)
    }
}