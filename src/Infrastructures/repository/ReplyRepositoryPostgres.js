const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();

        this._pool = pool;

        this._idGenerator = idGenerator;
    }

    async addReply(ownerId, commentId, newReply) {
        const { content } = newReply;

        const id = `reply-${this._idGenerator()}`;

        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, commentId, ownerId, false, date],
        }

        const result = await this._pool.query(query);

        return new AddedReply({ ...result.rows[0] });
    }

    async getRepliesByCommentId(commentId) {
        const query = {
            text: `
                SELECT replies.id, replies.date, users.username, replies.is_delete, replies.content
                    FROM replies
                        INNER JOIN users ON users.id = replies.owner
                            WHERE replies.comment_id = $1
                                ORDER BY replies.date ASC
            `,
            values: [commentId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async deleteReplyById(threadId, commentId, replyId) {
        const query = {
            text: `
                UPDATE replies r
                SET is_delete = true
                FROM comments c
                INNER JOIN threads t ON c.thread_id = t.id
                WHERE r.comment_id = c.id
                    AND t.id = $1
                    AND r.comment_id = $2
                    AND r.id = $3
            `,
            values: [threadId, commentId, replyId],
        };

        await this._pool.query(query);
    }

    async checkAvailableReply(replyId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('REPLY_NOT_FOUND');
        }
    }

    async verifyReplyOwner(replyId, ownerId) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
            values: [replyId, ownerId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new AuthorizationError('UNAUTHORIZED');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
