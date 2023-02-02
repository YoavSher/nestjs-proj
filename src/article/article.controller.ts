import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes";
import { AuthGuard } from "src/guard/auth.guard";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/user.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponse } from "./types/articleResponse.interface";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() author: UserEntity,
        @Body('article') articleInfo: CreateArticleDto): Promise<ArticleResponse> {
        const article = await this.articleService.createArticle(author, articleInfo)
        return this.articleService.buildArticleResponse(article)
    }
    @Get('/:slug')
    async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleResponse> {
        // console.log('slug:', slug)
        const article = await this.articleService.getArticleBySlug(slug)
        return this.articleService.buildArticleResponse(article)
    }
}