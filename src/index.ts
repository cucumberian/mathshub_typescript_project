'use strict';


import { DB } from '../../db/db.js';
import { Catalogue} from './modules/catalogue.js';
import { CommentManager } from './modules/comment.js';
import { UserManager } from './modules/userManager.js';
import { RatingManager } from './modules/rating.js';
import { Role } from './modules/user.js';
import { Genre } from './modules/genre.js';


function main() {
    console.log('Привет');

    // считываем данные из файла
    const usersParams = DB.user.map(user => deleteId(user));
    const booksParams = DB.book.map(book => deleteId(book));
    const commentsParams = DB.comment.map(comment => deleteId(comment));
    const ratingParams = DB.rating.map(rating => deleteId(rating));
    
    
    // Добавление книг
    const catalogue = new Catalogue();
    booksParams.forEach(bookParam => catalogue.addBook(bookParam));

    const ratingManager = new RatingManager();
    ratingParams.forEach(params => ratingManager.addRating(params));
    
    console.log(`Список книг: ${catalogue.getAllBooks().map(book => `\n\t${book}`)}`);


    // Управление пользователями
    console.log(`\nРабота с пользователями`);
    const userManager = new UserManager();
    // добавление рута
    const rootParams = {name: "root", email: "root@mail.root", role: Role.admin};
    const root = userManager.addUser(rootParams);
    console.log("Рут добавлен:", `${root}`);

    usersParams.forEach(userParams => userManager.addUser(userParams));
    
    console.log(`Список пользователей: ${userManager.getAllUsers().map( user => `\n\t${user}`)}`);
    console.log(`Удаление пользователей.`)
    // удалeние пользователей
    for (let id = 1; id < 10; id++) {
        if (root.delUser(userManager, id)) {
            console.log(`пользователь с id: ${id} успешно удален`);
        }
        else 
        console.log(`не удалось удалить пользователя с id: ${id}`);
    }
    console.log(`Новый список пользователей: ${userManager.getAllUsers().map( user => `\n\t${user}`)}`);
    // добавление пользователей
    for (let i = 0; i < 9; i++) {
        const addedUser = root.addUser(userManager, usersParams[i]);
        console.log(`Добавлен пользователь: ${addedUser}`);
    }
    console.log(`Список пользователей: ${userManager.getAllUsers().map( user => `\n\t${user}`)}`);
    // Вывожу последнего пользователя
    const lastUser = root.getUserList(userManager).at(-1);
    console.log(`Последний пользователь: ${lastUser}`);
    // Изменение последнего пользователя
    root.editUser(userManager, {name: "mihail", email: "miha@mail.com", role: "admin"}, lastUser.id);
    console.log(`Изменённый последний пользователь: ${lastUser}`);
    // Список книг от пользователя
    const allBooks = lastUser.getBookList(catalogue);
    console.log(`Список всех книг: ${allBooks.map(book => `\n\t${book}`)}`);


    // Работа с комментариями и рейтингом
    console.log('\nРабота с комментариями и рейтингом');
    const commentManager = new CommentManager();
    // Добавление комменатриев
    commentsParams.forEach(commentParams => commentManager.addComment(commentParams));
    console.log("все комментарии:", commentManager.getAllComments().map( comment => `${comment}`));
    const lastBook = lastUser.getBookList(catalogue).at(-1);
    // Добавление новго комментария
    lastUser.addCommentToBook("Я эту книгу не читал!", lastBook.id, commentManager);
    console.log("все комментарии:", commentManager.getAllComments().map( comment => `${comment}`));
    // Вывод всех комментариев у книги:
    const lastBookComments = lastBook.getAllComments(commentManager);
    console.log(`Комментарии для ${lastBook}: \n ${lastBookComments}`);
    let lastBookRating = ratingManager.getBookAverageRating(lastBook.id);
    console.log(`У книги ${lastBook} рейтинг: ${lastBookRating}`);
    lastUser.setBookRating(5, lastBook, ratingManager);
    lastBookRating = lastBook.getRating(ratingManager);
    console.log(`У книги ${lastBook} рейтинг: ${lastBookRating}`);


    
    // Работа с каталогом книг
    console.log(`\nРабота с каталогом игр`);
    const librarian = root.addUser(
        userManager, 
        {name: "Libra", email: "lib@mail.com", role: Role.librarian}
    );
    console.log(`Добавлен пользователь ${librarian}`);
    const bubblesBook = librarian.addBook(
        catalogue,
        {title: "Пузыри", author: "Не я", year: 2021, genre: Genre.Story},
    );
    console.log(`В каталог была добавлена книга ${bubblesBook}`);
    librarian.editBook(catalogue, {title: "А может и не пузыри", year: 2020}, bubblesBook.id);
    console.log(`Книга была изменена: ${bubblesBook}`); // доступ по ссылке
    librarian.delBook(catalogue, bubblesBook.id);
    console.log(`Книга [${bubblesBook}] была удалена из каталога`);
    console.log(`Каталог книг: ${librarian.getBookList(catalogue).map(book => `\n\t${book}`)}`);

    // Поиск книг пользователем
    const userBob = root.addUser(
        userManager,
        {name: "Bob", email: "bob@mail.com", role: Role.user}
    );
    console.log(`Создан просто пользователь [${userBob}]`);
    const normalBooks = userBob.getBookList(catalogue);
    console.log(`Список книг полученных пользвоателем ${userBob}: \n${normalBooks.map(book => `\n\t${book}`)}`);
    const booksFrom2022 = userBob.findBooks(catalogue, {year: 2020});
    console.log(`Список книг за 2022 год, надйнных пользователем ${userBob}: ${booksFrom2022.map(book => `\n\t${book}`)}`)
    const bobFavoriteBook = booksFrom2022[0];
    userBob.addFavoriteBook(bobFavoriteBook);
    userBob.addFavoriteBook(userBob.getBookList(catalogue).at(-2));
    console.log(`Список любимых бобом книжек:`, userBob.getFavorites(catalogue));
    console.log(`Удаляю послеюднюю уже не любимую бобом книжку`);
    userBob.delFavoriteBook(userBob.getFavorites(catalogue).at(-1));
    console.log(`Новый список любимых бобом книжек:`, userBob.getFavorites(catalogue));
    userBob.addCommentToBook(
        "Книга огонь! Сгораю!",
        userBob.getFavorites(catalogue).at(-1).id,
        commentManager
    );

    // Просмотр отзывов
    console.log(`Отзывы:`);
    for (let book of userBob.getBookList(catalogue)) {
        console.log(`\tКнига: ${book}`);
        for (let comment of book.getAllComments(commentManager)) {
            console.log(`\t\t${comment}`);
        }
    }
}

/**
 * Удаляет из объекта поле "id"
 * @param object - объект с полем "id"
 * @returns копию обекта без поля "id"
 */
function deleteId<T extends {"id": number}> (object: T): Omit<T, "id">  {
    const newObject = structuredClone(object);
    delete newObject["id"];
    return newObject;
}


main();
