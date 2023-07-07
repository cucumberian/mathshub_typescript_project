class DB {
    book_file: string = './db/books.json';
    comment_file: string = './db/comments.json';
    user_file: string = './db/users.json';
    users: User[];
    books: Book[];
    comments: Comment[];

    constructor() {
        this.users = this.load_users();
        this.books = this.load_books();
        this.comments = this.load_comments();
    }

    add_user(user_params: User_params): number {
        const last_user_id = this.users[this.users.length - 1].id;
        this.users.push(new User(user_params));
        return last_user_id;
    }

    del_user(user_id: number): boolean {
        return false;
    }

    load_objects_from_json(filename: string):object[] {
        let objects: object[] = [];
        fetch(filename)
            .then(response => response.json())
            .then(json => {
                for (let element of json) {
                    objects.push(element);
                }
            })
        return objects;
    }

    load_users(): User[] {
        const users: User[] = [];
        fetch(this.user_file)
            .then(response => response.json())
            .catch( error => {
                console.log("Не получилось получить файл");
            })
            .then(json => {
                for (let props of json) {
                    users.push(new User(props));
                }
            })
            .catch( error => {
                console.error("Не получилось распарсить JSON");
            });

        return users;
    }

    load_books(): Book[] {
        const books: Book[] = [];
        fetch(this.book_file)
            .then(response => response.json())
            .catch( error => {
                console.log("Не получилось получить файл");
            })
            .then(json => {
                for (let props of json) {
                    books.push(new Book(props));
                }
            })
            .catch( error => {
                console.error("Не получилось распарсить JSON");
            });

        return books;
    }

    load_comments(): Comment[] {
        const comments: Comment[] = [];
        fetch(this.book_file)
            .then(response => response.json())
            .catch( error => {
                console.log("Не получилось получить файл");
            })
            .then(json => {
                for (let props of json) {
                    comments.push(new Comment(props));
                }
            })
            .catch( error => {
                console.error("Не получилось распарсить JSON");
            });

        return comments;
    }

}

interface User_params {
    name: string;
    email: string;
    role: string;
}

class User implements User_params {
    id: number;
    name: string;
    email: string;
    role: string;

    constructor(user_params: User_params) {
        for (let [key, value] of Object.entries(user_params)) {
            this[key] = value;
        }
        this.id = 
    }

    toString(): string {
        const params_str = Object.values(this).map(value => `${value}`).join(", ");
        return `{${params_str}}`;
    }

    show_catalog(): void {}

    find_books(search_book_params: Partial<Book_params>): Book[] { return []; }

    add_favorite_book(book: Book): boolean { return false; }

    del_favorite_book(book: Book): boolean { return false; }

    add_comment_book(book: Book, comment: Comment): boolean { return false; };

}

class Admin extends User {
    add_user(user: User): void {};

    del_user(user: User): void {};

    edit_user(user: User, user_params: Partial<User_params>) {};
}

class Librarian extends User {
    add_book(book_params: Book_params) {}

    del_book(book: Book) {}

    edit_book(book: Book, book_params: Partial<Book_params>) {}
}

interface Book_params {
    title: string;
    author: string;
    year: number;
}
class Book implements Book_params {
    id: number;
    title: string;
    author: string;
    year: number;

    constructor(book_params: Book_params) {}
    find_book(pbook_params: Partial<Book_params>): Book[] {};
}

console.log("START INDEX at", new Date());
const db = new DB();
