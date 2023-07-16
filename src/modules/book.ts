import { Catalogue } from "./catalogue.js";
import { Comment, CommentManager } from "./comment.js";
import { Genre } from "./genre.js";
import { UserParams } from "./user.js";
import { UserManager } from "./userManager.js";
import { RatingManager } from "./rating.js";

interface BookParams {
    id: number;
    title: string;
    author: string;
    genre: Genre;
    year: number;
}


class Book implements BookParams {
    id: number;
    title: string;
    author: string;
    genre: Genre;
    year: number;

    constructor (bookParams: BookParams) {
        for (let [key, value] of Object.entries(bookParams)) {
            this[key] = value;
        }
    }

    setTitle(title: string): void { this.title = title; };
    setAauthor(author: string): void { this.author = author; };
    setGenre(genre: Genre): void { this.genre = genre; };
    setYear(year: number): void { this.year = year; };

    getTitle(): string     { return this.title; };
    getAuthor(): string    { return this.author; };
    getGenre(): Genre      { return this.genre; };
    getYear(): number      { return this.year; };

    toString(): string {
        return `"${this.getTitle()}" by ${this.getAuthor()}, ${this.getGenre()} (${this.getYear()})`;
    }

    getAllComments(commentManager: CommentManager): Comment[] {
        return commentManager.findComment({bookId: this.id});
    }

    getRating(ratingManager: RatingManager): number {
        return ratingManager.getBookAverageRating(this.id);
    }

}

export { BookParams, Book };
