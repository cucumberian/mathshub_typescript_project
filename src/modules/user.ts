import { Catalogue } from './catalogue';
import { BookParams, Book } from './book';
import { Comment, CommentManager, CommentParams } from './comment'; 
import { UserManager } from './userManager';
import { RatingManager } from './rating';

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
        bookSearchParams: Partial<Omit<BookParams, "id">>,
    ): Book[] | null {
        return catalogue.findBooks(bookSearchParams);
    };

    addCommentToBook(
        commentParams: Omit<CommentParams, "id">,
        commentManager: CommentManager,
    ): Comment {
        const newComment = commentManager.createNewComment(commentParams);
        commentManager.setComment(newComment);
        return newComment;
    }

    setBookRating(
        rating: number,
        book: Book,
        ratingManager: RatingManager,
    ) : void {
        const ratings = ratingManager.findRatings({userId: this.id, bookId: book.id});
        if (ratings.length === 0) {
            const newRating = ratingManager.createNewRating({
                rating: rating,
                bookId: book.id,
                userId: this.id,
            });
            ratingManager.setRating(newRating);
        }
        else {
            const firstRating = ratings[0]; // берем первый рейтинг (нет проверки на единственность)
            ratingManager.editRating(
                firstRating.id,
                {
                    rating: rating,
                    userId: this.id,
                    bookId: book.id
                }
            );
        }
    };

    getBookList(catalogue: Catalogue): Book[] {
        return catalogue.getAllBooks();
    }

    getUserList(userManager: UserManager): User[] {
        return userManager.getAllUsers();
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