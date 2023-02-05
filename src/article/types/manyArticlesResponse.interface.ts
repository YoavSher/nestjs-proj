import { ArticleType } from "./article.type";

export interface ManyArticlesResponse {
    articles: ArticleType[]
    articlesCount: number
}