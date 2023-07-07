import { BookParams, Book } from './book';

class Catalogue {
    bookMap: Map<number, Book>;

    createNewBook(bookParams: Omit<BookParams, "id">): Book {
        const lastId: number = this.bookMap.size;
        const book = new Book({
            id: lastId,
            ...bookParams,
        });
        return book;
    }

    addBook(book: Book): void {
        this.bookMap.set(book.id, book);
    };

    removeBook(book: Book): boolean {
        if (this.bookMap.has(book.id)) {
            this.bookMap.delete(book.id);
            return true;
        }
        return false;
    };

    findBook(bookParams: Partial<BookParams>): Book | null { 
        // a & b & c
        return null; 
    };
}

export { Catalogue };