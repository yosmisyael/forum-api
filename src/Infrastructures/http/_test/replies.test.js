const pool = require('../../database/postgres/pool');
const RepliesTableHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require("../createServer");

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await RepliesTableHelper.cleanTable();
        await CommentsTableHelper.cleanTable();
        await ThreadTableHelper.cleanTable();
        await UsersTableHelper.cleanTable();
        await CommentsTableHelper.cleanTable();
        await AuthenticationsTableHelper.cleanTable();
    });

    beforeEach(async () => {
        await UsersTableHelper.addUser({});
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response 401 when missing authentication', async () => {
            // Arrange
            const requestPayload = {
                content: 'a reply of a comment',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments/{commentId}/replies',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when missing required property', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {};

            const server = await createServer(container);

            const authResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(authResponse.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/{threadId}/comments/{commentId}/replies',
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
            await ThreadTableHelper.addThread({});

            await CommentsTableHelper.addComment({});

            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                content: 1,
            };

            const server = await createServer(container);

            const authResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(authResponse.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('provided data types are invalid');
        });

        it('should response 201 and persisted new reply', async () => {
            // Arrange
            await ThreadTableHelper.addThread({});

            await CommentsTableHelper.addComment({});

            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const payload = {
                content: 'a reply of a comment',
            };

            const server = await createServer(container);

            const authResponse = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const { data: { accessToken } } = JSON.parse(authResponse.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: payload,
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.addedReply.content).toEqual(payload.content);

            expect(responseJson.data.addedReply.owner).toEqual('user-123');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        beforeEach(async () => {
            await ThreadTableHelper.addThread({});

            await CommentsTableHelper.addComment({});

            await RepliesTableHelper.addReply({});
        });

        it('should response 401 when missing authentication', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 403 when unauthorized user trying to delete other user reply', async () => {
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
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(403);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('UNAUTHORIZED');
        });

        it('should response 200 when deleting reply successfully', async () => {
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
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);

            expect(responseJson.status).toEqual('success');
        });
    });
});