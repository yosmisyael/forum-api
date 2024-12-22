const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const createServer = require("../createServer");
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    let server;

    beforeAll(async () => {
        server = await createServer(container);

        await UserTableTestHelper.addUser({});

        await ThreadsTableTestHelper.addThread({});

        await CommentsTableTestHelper.addComment({});
    });

    afterAll(async () => {
        await CommentsTableTestHelper.cleanTable();

        await ThreadsTableTestHelper.cleanTable();

        await UserTableTestHelper.cleanTable();

        await AuthenticationTestHelper.cleanTable();

        await pool.end();
    });

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        let accessToken;

        beforeAll(async () => {
            const response = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'dicoding',
                    password: 'secret',
                },
            });

            accessToken = JSON.parse(response.payload).data.accessToken;
        });

        it('should response 401 when missing authentication', async () => {
            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toBe(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 404 when thread is not found', async () => {
            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-error/comments/comment-123/likes',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toBe(404);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('THREAD_NOT_FOUND');
        });

        it('should response 404 when comment is not found', async () => {
            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-error/likes',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toBe(404);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('COMMENT_NOT_FOUND');
        });

        it('should response 200 and persist added like', async () => {
            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            const likesCount = await LikesTableTestHelper.findLikesByCommentId('comment-123');

            expect(response.statusCode).toBe(200);

            expect(responseJson.status).toEqual('success');

            expect(likesCount.length).toEqual(1);
        });

        it('should response 200 and persist removed like', async () => {
            // Arrange
            await LikesTableTestHelper.addLike({});

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: '/threads/thread-123/comments/comment-123/likes',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            const likesCount = await LikesTableTestHelper.findLikesByCommentId('comment-123');

            expect(response.statusCode).toBe(200);

            expect(responseJson.status).toEqual('success');

            expect(likesCount.length).toEqual(0);
        });
    });
});