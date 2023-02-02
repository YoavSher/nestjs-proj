import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, Query } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes";
import { AuthGuard } from "src/guard/auth.guard";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/user.entity";
import { DeleteResult } from "typeorm";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { UpdatedArticleDto } from "./dto/updatedArticle.dto";
import { ArticleResponse } from "./types/articleResponse.interface";
import { ManyArticlesResponse } from "./types/manyArticlesResponse.interface";

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) { }
    @Get()
    async getArticles(@User('id') authorId: number, @Query() queryFilter: any)
        : Promise<ManyArticlesResponse> {

        return this.articleService.getArticles(authorId, queryFilter)
    }

    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createArticle(@User() author: UserEntity,
        @Body('article') articleInfo: CreateArticleDto): Promise<ArticleResponse> {
        const article = await this.articleService.createArticle(author, articleInfo)
        return this.articleService.buildArticleResponse(article)
    }

    @Get(':slug')
    async getArticleBySlug(@Param('slug') slug: string): Promise<ArticleResponse> {
        // console.log('slug:', slug)
        const article = await this.articleService.getArticleBySlug(slug)
        return this.articleService.buildArticleResponse(article)
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async deleteArticle(@User('id') authorId: number, @Param('slug') slug: string)
        : Promise<DeleteResult> {
        return await this.articleService.deleteArticle(authorId, slug)
    }

    @Put(':slug')
    @UseGuards(AuthGuard)
    async updateArticle(@User('id') authorId: number,
        @Param('slug') slug: string,
        @Body('article') articleInfo: UpdatedArticleDto) {

        const article = await this.articleService.updateArticle(authorId, slug, articleInfo)
        return this.articleService.buildArticleResponse(article)
    }
}