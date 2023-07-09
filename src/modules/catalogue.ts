import { BookParams, Book } from './book';

class Catalogue {
    bookMap: Map<number, Book>;

    getAllBooks(): Book[] {
        return Object.values(Object.fromEntries(this.bookMap));
    }

    createNewBook(bookParams: Omit<BookParams, "id">): Book {
        const lastId: number = this.bookMap.size;
        const book = new Book({
            id: lastId,
            ...bookParams,
        });
        return book;
    }

    getBook(bookId: number): Book | null {
        const book = this.bookMap.get(bookId);
        if (book)
            return book;
        else
            return null;
    }

    setBook(book: Book): void {
        this.bookMap.set(book.id, book);
    };

    removeBook(book: Book): boolean {
        if (this.bookMap.has(book.id)) {
            this.bookMap.delete(book.id);
            return true;
        }
        return false;
    };

    editBook(bookId: number, newBookParams: Partial<Omit<BookParams, "id">>): boolean {
        const editedBook = this.bookMap.get(bookId);
        if (editedBook === undefined)
            return false;
        
        for (let [key, value] of Object.entries(newBookParams))
            editedBook[key] = value;
        return true;
    }

    findBooks(bookParams: Partial<Omit<BookParams, "id">>): Book[] { 
        let books = this.getAllBooks();
        for (let [key, value] of Object.entries(bookParams)) {
            books = books.filter( book => {
                book[key] === value;
            });
        }
        return books;
    };
}

export { Catalogue };