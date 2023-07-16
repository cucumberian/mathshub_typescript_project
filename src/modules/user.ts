import { Catalogue } from './catalogue.js';
import { BookParams, Book } from './book.js';
import { Comment, CommentManager, CommentParams } from './comment.js'; 
import { UserManager } from './userManager.js';
import { RatingManager } from './rating';

enum Role {admin, librarian, user};


interface UserParams {
    id: number;
    name: string;
    email: string;
    role: Role | string;
    favorites?: Set<number>;
}


class User implements UserParams {
    id: number;
    name: string;
    email: string;
    role: Role | string;
    favorites?: Set<number>;

    constructor(userParams: UserParams) {
        
        for (let [key, value] of Object.entries(userParams)) {
            this[key] = value;
        }
        
        if (!(this.role in Role))
            throw new Error(`Unexpected user role: ${this.role}, user.role must be in ${Role}`);
        else 
            this.role = this.role;

        if (this.favorites === undefined) {
            this.favorites = new Set();
        }
    }

    // Magick methods
    toString(): string {
        return `${this.name} [${this.email}], role: ${this.role}`;
    }

    // Common methods
    findBooks(
        catalogue: Catalogue, 
        bookSearchParams: Partial<Omit<BookParams, "id">>,
    ): Book[] | null {
        return catalogue.findBooks(bookSearchParams);
    };

    addCommentToBook(
        text: string,
        bookId: number,
        commentManager: CommentManager,
    ): Comment {
        const commentParams = {text, bookId, userId: this.id, };
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
        this.favorites.add(book.id);
    }

    delFavoriteBook(book: Book): void {
        this.favorites.delete(book.id);
    }

    getFavorites(catalogue: Catalogue): Book[] {
        const favorites: Book[] = [];
        const favoritesIds = Array.from(this.favorites.values());
        favoritesIds.forEach( id => favorites.push(catalogue.getBook(id)));
        return favorites;
    }

    getComments(commentManager: CommentManager): Comment[] {
        const userComments = commentManager.getAllUserComments(this.id);
        return userComments;
    }


    // Admin methods
    addUser(userManager: UserManager, userParams: Omit<UserParams, "id">): User | null {
        if (this.role === Role.admin)
            return userManager.addUser(userParams);
        else
            return null;
    }

    delUser(userManager: UserManager, userId): boolean | null {
        if (this.role === Role.admin) {
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
        if (this.role === Role.admin) {
            return userManager.editUser(userId, userParams)
        }
        else
            return null;
    }
    //

    // Librarian methods
    addBook(catalogue: Catalogue, bookParams: Omit<BookParams, "id">): Book | null {
        if (this.role === Role.librarian) {
            const newBook = catalogue.createNewBook(bookParams);
            catalogue.setBook(newBook);
            return newBook;
        }
        else
            return null;
    }

    delBook(catalogue: Catalogue, bookId): boolean | null {
        if (this.role === Role.librarian)
            return catalogue.removeBook(bookId);
        else
            return null;
    }
    
    editBook(
        catalogue: Catalogue,
        bookParams: Partial<Omit<BookParams, "id">>,
        bookId: number,
    ): boolean | null {
        if (this.role === Role.librarian) {
            return catalogue.editBook(bookId, bookParams);
        }
        else
            return null;
    }
    //
    
};


export { UserParams, User, Role};