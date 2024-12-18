/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
                              id = 'reply-123',
                              content = 'test-content',
                              commentId = 'comment-123',
                              owner = 'user-123',
                              isDelete = false,
                              date = new Date().toISOString(),
                          }) {
        const query = {
            text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, content, commentId, owner, isDelete, date],
        };

        await pool.query(query);
    },

    async findRepliesById(id) {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM replies');
    },
};

module.exports = RepliesTableTestHelper;