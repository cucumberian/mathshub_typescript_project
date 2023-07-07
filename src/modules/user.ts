import { Catalogue } from './catalogue';
import { BookParams, Book } from './book';
import { BookComment } from './bookComment'; 


enum Role {Admin, Librarian, User};


interface UserParams {
    id: number;
    name: string;
    email: string;
    role: Role;
    favorites: Map<number, Book>;
}


class User implements UserParams {
    id: number;
    name: string;
    email: string;
    role: Role;
    favorites: Map<number, Book>;

    constructor(userParams: UserParams) {
        for (let [key, value] of Object.entries(userParams)) {
            this[key] = value;
        }
        // overwrite important value;
        this.role = Role.User;
    }

    listCatalogue(catalogue: Catalogue) {};

    findBooks(
        catalogue: Catalogue, 
        bookSearchParams: Partial<BookParams>,
    ): Book[] | null {
        return null;
    };

    addBookToFavorites(book: Book): boolean {
        return false;
    }

    delBookFromFavorites(book: Book): boolean {
        return false;
    }

    addCommentToBook(book: Book, text: string): BookComment | null {
        const comment: BookComment = {
            text: text, 
            date: new Date(),
            userId: this.id,
            bookId: book.id,
        };
        return comment;
    }
};


export { UserParams, User, Role};