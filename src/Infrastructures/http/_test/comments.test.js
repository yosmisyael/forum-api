const RepliesTableHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require("../createServer");
const pool = require('../../database/postgres/pool');

describe('/threads/{threadId}/comments endpoint', () => {
    beforeEach(async () => {
        await UsersTableHelper.addUser({});

        await ThreadTableHelper.addThread({});
    });

    afterEach(async () => {
        await AuthenticationsTableHelper.cleanTable();

        await UsersTableHelper.cleanTable();

        await CommentsTableHelper.cleanTable();

        await ThreadTableHelper.cleanTable();

        await RepliesTableHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response 401 when missing authentication', async () => {
            // Arrange
            const requestPayload = {
                content: 'a comment'
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload does not contain required property', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {};

            const server = await createServer(container);

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('missing required properties');
        });

        it('should response 400 when request payload has invalid property type', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                content: 1,
            };

            const server = await createServer(container);

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('provided data types are invalid');
        });

        it('should response 201 and persisted the new comment', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                content: 'a comment',
            };

            const server = await createServer(container);

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.addedComment.content).toBe('a comment');

            expect(responseJson.data.addedComment.owner).toBe('user-123');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        beforeEach(async () => {
            await CommentsTableHelper.addComment({});
        });

        it('should response 401 when missing authentication', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/random',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 403 when unauthorized user trying to delete other user comment', async () => {
            // Arrange
            await UsersTableHelper.addUser({
                id: 'user-234',
                username: 'jose',
                fullname: 'Jose',
            });

            const nonOwnerLoginPayload = {
                username: 'jose',
                password: 'secret',
            };

            const server = await createServer(container);

            const nonOwnerAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: nonOwnerLoginPayload,
            });

            const { data: { accessToken } } = JSON.parse(nonOwnerAuth.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(403);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('UNAUTHORIZED');
        });

        it('should response 200 when deleting comment successfully', async () => {
            // Arrange
            const server = await createServer(container);

            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);

            expect(responseJson.status).toEqual('success');
        });
    });
});
