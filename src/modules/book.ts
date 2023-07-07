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
}

export { BookParams, Book };