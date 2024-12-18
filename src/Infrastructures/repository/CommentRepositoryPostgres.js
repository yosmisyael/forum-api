const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComment = require("../../Domains/comments/entities/AddedComment");
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
    constructor(pool, idGenerator) {
        super();

        this._pool = pool;

        this._idGenerator = idGenerator;
    }

    async addComment(threadId, ownerId, newComment) {
        const { content } = newComment;

        const id = `comment-${this._idGenerator()}`;

        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, date, owner',
            values: [id, content, date, ownerId, threadId, false],
        };

        const result = await this._pool.query(query);

        return new AddedComment({ ...result.rows[0] });
    }

    async checkAvailableComment(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('COMMENT_NOT_FOUND');
        }
    }

    async verifyCommentOwner(commentId, ownerId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
            values: [commentId, ownerId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('UNAUTHORIZED');
        }
    }

    async deleteCommentById(threadId, commentId) {
        const query = {
            text: 'UPDATE comments SET is_delete = true WHERE thread_id = $1 AND id = $2',
            values: [threadId, commentId],
        };

        await this._pool.query(query);
    }

    async getCommentByThreadId(threadId) {
        const query = {
            text: `
        SELECT comments.id, users.username, comments.date, comments.is_delete, 
               comments.content
        FROM comments
        INNER JOIN users ON comments.owner = users.id
        WHERE comments.thread_id = $1
        GROUP BY comments.id, users.username, comments.date
        ORDER BY comments.date ASC
      `,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = CommentRepositoryPostgres;