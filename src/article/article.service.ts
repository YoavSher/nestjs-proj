import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import slugify from "slugify";
import { UserEntity } from "src/user/user.entity";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { UpdatedArticleDto } from "./dto/updatedArticle.dto";
import { ArticleResponse } from "./types/articleResponse.interface";

@Injectable()
export class ArticleService {
    constructor(@InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
        private readonly dataSource: DataSource,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,) { }

    async getArticles(authorId: number, filterBy: any) {
        const queryBuilder = this.dataSource.getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')
        queryBuilder.orderBy('articles.createdAt', 'DESC')

        if (filterBy.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${filterBy.tag}%`
            })
        }

        if (filterBy.author) {
            const author = await this.userRepository.findOne({ where: { username: filterBy.author } })
            queryBuilder.andWhere('articles.authorId = :id', {
                id: author.id
            })
        }

        const articlesCount = await queryBuilder.getCount()

        if (filterBy.limit) queryBuilder.limit(filterBy.limit)

        if (filterBy.offset) queryBuilder.offset(filterBy.offset)

        const articles = await queryBuilder.getMany()



        return { articles, articlesCount }
    }

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
    async deleteArticle(authorId: number, slug: string): Promise<DeleteResult> {
        const article = await this.getArticleBySlug(slug)
        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
        }
        if (article.author.id !== authorId) {
            throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
        }
        return await this.articleRepository.delete({ id: article.id })
        // console.log('article:', article.author)
    }

    async updateArticle(authorId: number, slug: string, infoToUpdate: UpdatedArticleDto):
        Promise<ArticleEntity> {
        const article = await this.getArticleBySlug(slug)
        if (!article) {
            throw new HttpException('Article not found', HttpStatus.NOT_FOUND)
        }
        if (article.author.id !== authorId) {
            throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
        }
        Object.assign(article, infoToUpdate)
        if (infoToUpdate.title) {
            article.slug = this.getSlug(infoToUpdate.title)
        }
        return await this.articleRepository.save(article)
    }
    private getSlug(slug: string): string {
        return `${slugify(slug, { lower: true })}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`
    }
}