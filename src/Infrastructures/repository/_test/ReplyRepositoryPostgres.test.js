const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});
        await ThreadsTableTestHelper.addThread({});
        await CommentsTableTestHelper.addComment({});
    });

    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addReplyComment function', () => {
        it('should persist adding reply and return added reply correctly', async () => {
            const newReply = new AddReply({
                content: 'test-reply',
            });
            const idFaker = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                idFaker,
            );

            await replyRepositoryPostgres.addReply(
                'user-123',
                'comment-123',
                newReply,
            );

            const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
            expect(reply).toHaveLength(1);
        });

        it('should return added reply correctly', async () => {
            const newReply = new AddReply({
                content: 'test-reply',
            });

            const idFaker = () => '123';
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(
                pool,
                idFaker,
            );

            const addedReply = await replyRepositoryPostgres.addReply(
                'user-123',
                'comment-123',
                newReply,
            );

            expect(addedReply).toStrictEqual(
                new AddedReply({
                    id: 'reply-123',
                    content: 'test-reply',
                    owner: 'user-123',
                }),
            );
        });
    });

    describe('getRepliesByCommentId function', () => {
        it('should return correct replies', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                content: 'test-first-reply',
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-456',
                content: 'test-second-reply',
            });

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-123');

            // Assert
            expect(replies).toHaveLength(2);

            expect(replies[0]).toEqual(expect.objectContaining({
                id: 'reply-123',
                username: 'dicoding',
                content: 'test-first-reply',
                is_delete: false,
                date: expect.any(String),
            }));

            expect(replies[1]).toStrictEqual({
                id: 'reply-456',
                username: 'dicoding',
                content: 'test-second-reply',
                is_delete: false,
                date: expect.any(String),
            });
        });

        it('should return empty replies but does not throw error', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const replies = await replyRepositoryPostgres.getRepliesByCommentId(
                'comment-123',
            );

            // Assert
            expect(Array.isArray(replies)).toBeTruthy();
            expect(replies).toHaveLength(0);
        });
    });

    describe('checkAvailableReply function', () => {
        it('should not throw error if reply is available', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({});

            // Action & Assert
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.checkAvailableReply('reply-123'))
                .resolves
                .not
                .toThrow(NotFoundError);
        });
        it('should throw error if reply is not found', async () => {
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            await expect(replyRepositoryPostgres.checkAvailableReply('reply-123'))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('deleteReplyById function', () => {
        it('should be able to delete reply', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({});

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            replyRepositoryPostgres.deleteReplyById(
                'thread-123',
                'comment-123',
                'reply-123',
            );

            const replies = await replyRepositoryPostgres.getRepliesByCommentId(
                'comment-123',
            );

            // Assert
            expect(replies[0].is_delete).toEqual(true);
        });
    });

    describe('verifyReplyOwner function', () => {
        it('should throw AuthorizationError if not the owner of reply', async () => {
            await RepliesTableTestHelper.addReply({});

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456'))
                .rejects
                .toThrow(AuthorizationError);
        });

        it('should not throw error if user is the owner of reply', async () => {
            await RepliesTableTestHelper.addReply({});

            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
                .resolves
                .not
                .toThrow(AuthorizationError);
        });
    });
});