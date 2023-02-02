import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { ArticleResponse } from "./types/articleResponse.interface";

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>) { }
    buildArticleResponse(article: ArticleEntity): ArticleResponse {
        return { article }
    }
    async createArticle(author: UserEntity, articleInfo: CreateArticleDto): Promise<ArticleEntity> {
        const newArticle = new ArticleEntity()
        Object.assign(newArticle, articleInfo)
        newArticle.tagList = articleInfo.tagList ? articleInfo.tagList : []
        newArticle.author = author
        newArticle.slug = this.getSlug(articleInfo.title)
        return await this.articleRepository.save(newArticle)
    }
    async getArticleBySlug(slug: string): Promise<ArticleEntity> {
        console.log('slug:', slug)
        return await this.articleRepository.findOne({ where: { slug } })

    }
    private getSlug(slug: string): string {
        return `${slugify(slug, { lower: true })}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`
    }
}