/* istanbul ignore file */
const pool = require('src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
    async addLike({
        id = 'like-123',
        owner = 'user-123',
        commentId = 'comment-123',
                  }){
        const query = {
            text: 'INSERT INTO likes VALUES ($1, $2, $3)',
            values: [id, owner, commentId],
        };

        await pool.query(query);
    },

    async cleanTable() {
        const query = {
            text: 'DELETE FROM likes',
        };

        await pool.query(query);
    },
};

module.exports = LikesTableTestHelper;