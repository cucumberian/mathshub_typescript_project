interface CommentParams {
    id: number;
    text: string;
    date: Date;
    bookId: number;
    userId: number;
}

class Comment implements CommentParams{
    id: number;
    text: string;
    date: Date;
    bookId: number;
    userId: number;

    constructor(commentParams: CommentParams) {
        for ( let [key, value] of Object.entries(commentParams)) {
            this[key] = value;
        }
    }
}


class CommentManager {
    comments: Map<number, Comment> = new Map();

    getAllComments(): Comment[] {
        return Object.values(Object.fromEntries(this.comments));
    }

    createNewComment(commentParams: Omit<Comment, "id">): Comment {
        const lastId: number = this.comments.size;
        const newComment = new Comment({id: lastId, ...commentParams});
        return newComment;
    }

    setComment(comment: Comment) {
        this.comments.set(comment.id, comment);
    }

    removeComment(commentId: number): boolean {
        if (this.comments.has(commentId)) {
            this.comments.get(commentId);
            return true;
        }
        else
            return false
    }

    editComment(commentId, newCommentParams: Partial<Omit<CommentParams, "id">>): boolean {
        const editedComment = this.comments.get(commentId);
        if (editedComment === undefined)
            return false;
        
        for(let [key, value] of Object.entries(newCommentParams))
            editedComment[key] = value;
        return true;
    }

    getAllUserComments(userId: number): Comment[] {
        return this.getAllComments().filter( comment => comment.userId === userId);
    }

    getAllBookComments(bookId: number): Comment[] {
        return this.getAllComments().filter( comment => comment.userId === bookId);
    }

    findComment(commentParams: Partial<Omit<CommentParams, "id">>): Comment[] {
        let comments = this.getAllComments();
        for (let [key, value] of Object.entries(commentParams)) {
            comments = comments.filter( comment => comment[key] === value);
        }
        return comments;
    }

}

export { CommentParams, Comment, CommentManager };