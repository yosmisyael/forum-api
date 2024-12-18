const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require("../../Domains/threads/entities/AddedThread");
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(ownerId, newThread) {
        const { title, body } = newThread;

        const id = `thread-${this._idGenerator()}`;

        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, date, ownerId],
        };

        const result = await this._pool.query(query);

        return new AddedThread({ ...result.rows[0] });
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
                FROM threads 
                    LEFT JOIN users ON users.id = threads.owner    
                        WHERE threads.id = $1`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('THREAD_NOT_FOUND');
        }

        return result.rows[0];
    }

    async checkAvailableThread(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('THREAD_NOT_FOUND');
        }
    }
}

module.exports = ThreadRepositoryPostgres;