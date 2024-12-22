const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();

        this._pool = pool;

        this._idGenerator = idGenerator;
    }

    async addLike(userId, commentId) {
        const id = `like-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO likes VALUES ($1, $2, $3)',
            values: [id, userId, commentId],
        };

        return this._pool.query(query);
    }

    async deleteLike(likeId) {
        const query = {
            text: 'DELETE FROM likes WHERE id = $1',
            values: [likeId],
        };

        await this._pool.query(query);
    }

    async verifyLikeExists(ownerId, commentId) {
        const query = {
            text: 'SELECT id FROM likes WHERE owner = $1 OR comment_id = $2',
            values: [ownerId, commentId],
        }

        const { rowCount } = await this._pool.query(query);

        return Boolean(rowCount);
    }

    async getLikesByCommentId(commentId) {
        const query = {
            text: 'SELECT id FROM likes WHERE comment_id = $1',
            values: [commentId],
        }

        const { rowCount } = await this._pool.query(query);

        return rowCount;
    }

}

module.exports = LikeRepositoryPostgres;