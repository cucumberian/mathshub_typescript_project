import { User } from './user';
import { BookParams, Book } from './book';
import { Catalogue } from './catalogue';

class Librarian extends User {

    addBook(
        bookParams: Omit<BookParams, "id">, 
        catalogue: Catalogue,
    ): Book {
        const newBook = catalogue.createNewBook(bookParams);
        catalogue.addBook(newBook);
        return newBook;
    }

    removeBook(
        book: Book,
        catalogue: Catalogue
    ): boolean {
        return catalogue.removeBook(book);
    }

    editBook(
        book: Book, 
        catalogue: Catalogue, 
        newBookParams: Partial<Omit<BookParams, "id">>,
    ): boolean { 
        return false; 
    }
}

export { Librarian };
