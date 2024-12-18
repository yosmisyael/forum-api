const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe('ThreadRepositoryPostgres', () => {
    const owner = 'test-user-1';

    beforeAll(async () => {
        await UsersTableTestHelper.addUser({ id: owner });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist thread and return thread correctly', async () => {
            // Arrange
            const newThread = new AddThread({
                title: 'test-title',
                body: 'test-content',
            });

            const idFaker = () => '123';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, idFaker);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(
                'test-user-1',
                newThread,
            );

            // Assert
            const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
            expect(thread).toHaveLength(1);
            expect(addedThread).toStrictEqual(
                new AddedThread({
                    id: 'thread-123',
                    title: 'test-title',
                    owner: 'test-user-1',
                }),
            );
        })
    });

    describe('getThreadById function', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.getThreadById('not found thread'))
                .rejects
                .toThrow(NotFoundError);
        });

        it('should return thread correctly', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({
                title: 'test-title',
                body: 'test-content',
                owner
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const thread = await threadRepositoryPostgres.getThreadById('thread-123');

            // Assert
            expect(thread).toStrictEqual({
                id: 'thread-123',
                title: 'test-title',
                username: 'dicoding',
                body: 'test-content',
                date: expect.any(String),
            });
        })
    });

    describe('checkAvailableThread', () => {
        it('should not throw error if thread available', async () => {
            // Arrange
            await ThreadsTableTestHelper.addThread({
                title: 'Thread title',
                body: 'Content of a thread',
                owner: owner,
            });

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(
                threadRepositoryPostgres.checkAvailableThread('thread-123'),
            ).resolves.not.toThrow(NotFoundError);
        });

        it('should throw NotFoundError if thread not available', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.checkAvailableThread('not found thread'))
                .rejects
                .toThrow(NotFoundError);
        });
    });
});