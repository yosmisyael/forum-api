const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});

        await ThreadsTableTestHelper.addThread({});
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment and return added comment correctly', async () => {
            // Arrange
            const newComment = new AddComment({
                content: 'test-comment',
            });
            const idFaker = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(
                pool,
                idFaker,
            );

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(
                'thread-123',
                'user-123',
                newComment,
            );

            // Assert
            const comment = await CommentsTableTestHelper.findCommentsById(
                'comment-123',
            );

            expect(comment).toHaveLength(1);
            expect(addedComment).toStrictEqual(
                new AddedComment({
                    id: 'comment-123',
                    content: 'test-comment',
                    owner: 'user-123',
                }),
            );
        });
    });

    describe('getCommentByThreadId function', () => {
        it('should return comments correctly', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'test-first-comment',
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-456',
                content: 'test-second-comment',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const comments = await commentRepositoryPostgres.getCommentByThreadId(
                'thread-123',
            );

            // Assert
            expect(comments).toHaveLength(2);

            expect(comments[0]).toStrictEqual({
                id: 'comment-123',
                username: 'dicoding',
                content: 'test-first-comment',
                is_delete: false,
                date: expect.any(String),
                like_count: '0',
            });

            expect(comments[1]).toStrictEqual({
                id: 'comment-456',
                username: 'dicoding',
                content: 'test-second-comment',
                is_delete: false,
                date: expect.any(String),
                like_count: '0',
            });
        });

        it('should return empty comments and does not throw error', async () => {
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            const comments = await commentRepositoryPostgres.getCommentByThreadId(
                'thread-123',
            );

            expect(Array.isArray(comments)).toBeTruthy();
            expect(comments).toHaveLength(0);
        });
    });

    describe('checkAvailableComment function', () => {
        it('should not throw error if comments are found', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.checkAvailableComment('comment-123'))
                .resolves
                .not
                .toThrow(NotFoundError);
        });

        it('should throw error if comment is not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.checkAvailableComment('comment-123'))
                .rejects
                .toThrow(NotFoundError);
        });
    });

    describe('deleteCommentById function', () => {
        it('should be able to delete comment', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            await commentRepositoryPostgres.deleteCommentById('thread-123', 'comment-123');

            const comments = await commentRepositoryPostgres.getCommentByThreadId(
                'thread-123',
            );

            // Assert
            expect(comments[0].is_delete).toEqual(true);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw AuthorizationError if not the owner of comment', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({});

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
                .rejects
                .toThrow(AuthorizationError);
        });

        it('should not throw error if user is the owner of comment', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                threadId: 'thread-123',
                owner: 'user-123',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner(
                'comment-123',
                'user-123'))
                .resolves
                .not
                .toThrow(AuthorizationError);
        });
    });
});