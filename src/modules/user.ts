import { Catalogue } from './catalogue';
import { BookParams, Book } from './book';
import { Comment, CommentManager, CommentParams } from './comment'; 
import { UserManager } from './userManager';

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
    }

    // Common methods
    findBooks(
        catalogue: Catalogue, 
        bookSearchParams: Partial<BookParams>,
    ): Book[] | null {
        return null;
    };

    addCommentToBook(
        commentParams: Omit<CommentParams, "id">,
        commentManager: CommentManager,
    ): Comment {
        const newComment = commentManager.createNewComment(commentParams);
        commentManager.setComment(newComment);
        return newComment;
    }

    getBookList(catalogue: Catalogue): Book[] {
        return catalogue.getAllBooks();
    }

    getUserList(userManager: UserManager): User[] {
        return userManager.getAllUsers();
    }
    
    findBook(catalogue: Catalogue, bookParams: Partial<Omit<BookParams, "id">>): Book[] {
        return catalogue.findBooks(bookParams);
    }

    addFavoriteBook(book: Book): void {
        this.favorites.set(book.id, book);
    }

    delFavoriteBook(book: Book): void {
        this.favorites.delete(book.id);
    }

    listFavorites(): Book[] {
        return Object.values(Object.fromEntries(this.favorites));
    }


    // Admin methods
    addUser(userManager: UserManager, userParams: Omit<UserParams, "id">): User | null {
        if (this.role === Role.Admin) {
            const newUser = userManager.createNewUser(userParams);
            userManager.setUser(newUser);
            return newUser;
        }
        else
            return null;
    }

    delUser(userManager: UserManager, userId): boolean | null {
        if (this.role === Role.Admin) {
            return userManager.removeUser(userId);
        }
        else 
            return null;
    }

    editUser(
        userManager: UserManager,
        userParams: Partial<Omit<UserParams, "id">>,
        userId: number,
    ): boolean | null {
        if (this.role === Role.Admin) {
            return userManager.editUser(userId, userParams)
        }
        else
            return null;
    }
    //

    // Librarian methods
    addBook(catalogue: Catalogue, bookParams: Omit<BookParams, "id">): Book | null {
        if (this.role === Role.Librarian) {
            const newBook = catalogue.createNewBook(bookParams);
            catalogue.setBook(newBook);
            return newBook;
        }
        else
            return null;
    }

    delBook(catalogue: Catalogue, bookId): boolean | null {
        if (this.role === Role.Librarian)
            return catalogue.removeBook(bookId);
        else
            return null;
    }
    
    editBook(
        catalogue: Catalogue,
        bookParams: Partial<Omit<BookParams, "id">>,
        bookId: number,
    ): boolean | null {
        if (this.role === Role.Librarian) {
            return catalogue.editBook(bookId, bookParams);
        }
        else
            return null;
    }
    //
    
};


export { UserParams, User, Role};