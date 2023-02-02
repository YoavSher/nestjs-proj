import { ArticleEntity } from "../article.entity";

export interface ManyArticlesResponse {
    articles: ArticleEntity[]
    articlesCount: number
}