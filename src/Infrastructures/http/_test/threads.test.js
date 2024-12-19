const pool = require('../../database/postgres/pool');
const RepliesTableHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadTableHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require("../createServer");

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await RepliesTableHelper.cleanTable();
        await CommentsTableHelper.cleanTable();
        await ThreadTableHelper.cleanTable();
        await UsersTableHelper.cleanTable();
        await AuthenticationsTableHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 401 when missing authentication', async () => {
            // Arrange
            const requestPayload = {
                title: 'a title of a thread',
                body: 'a body of a thread',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });


            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);

            expect(responseJson.error).toEqual('Unauthorized');

            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response 400 when request payload does not contain needed property', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                title: 'a title of a thread',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: loginPayload.username,
                    password: loginPayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const authResponse = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
            });


            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message)
                .toEqual('missing required properties');
        });

        it('should response 400 when request payload has invalid property type', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                title: 'a title of a thread',
                body: 100,
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: loginPayload.username,
                    password: loginPayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const authResponse = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message)
                .toEqual('provided data types are invalid');
        });

        it('should response 201 and persisted thread', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const requestPayload = {
                title: 'a title of a thread',
                body: 'a body of a thread',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: loginPayload.username,
                    password: loginPayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const authResponse = JSON.parse(auth.payload);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(201);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
        });
    });

    describe('when GET /threads/{threadId}', () => {
        it('should response 404 when thread is not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/not-found-thread',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);

            expect(responseJson.status).toEqual('fail');

            expect(responseJson.message).toEqual('THREAD_NOT_FOUND');
        });

        it('should return a thread with details correctly', async () => {
            // Arrange
            const loginPayload = {
                username: 'dicoding',
                password: 'secret',
            };

            const threadPayload = {
                title: 'a title of a thread',
                body: 'a body of a thread',
            };

            const commentPayload = {
                content: 'a comment on a thread',
            };

            const replyPayload = {
                content: 'a reply on a comment',
            };

            const server = await createServer(container);

            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: loginPayload.username,
                    password: loginPayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: loginPayload,
            });

            const authResponse = JSON.parse(auth.payload);

            const authToken = authResponse.data.accessToken;

            // Action
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: threadPayload,
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const threadResponse = JSON.parse(thread.payload);

            const threadId = threadResponse.data.addedThread.id;

            const comment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: commentPayload,
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const commentResponse = JSON.parse(comment.payload);

            const commentId = commentResponse.data.addedComment.id;

            await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: replyPayload,
                headers: { Authorization: `Bearer ${authToken}` },
            });

            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);

            expect(responseJson.status).toEqual('success');

            expect(responseJson.data.thread.title).toEqual(threadPayload.title);

            expect(responseJson.data.thread.body).toEqual(threadPayload.body);

            expect(responseJson.data.thread.username).toEqual(loginPayload.username);

            expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);

            expect(Array.isArray(responseJson.data.thread.comments[0].replies)).toBe(true);
        });
    });
});