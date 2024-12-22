const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe('LikeRepositoryPostgres', () => {
    beforeAll(async () => {
        await UsersTableTestHelper.addUser({});

        await ThreadsTableTestHelper.addThread({});

        await CommentsTableTestHelper.addComment({});
    });

    afterEach(async () => {
        await LikesTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await CommentsTableTestHelper.cleanTable();

        await ThreadsTableTestHelper.cleanTable();

        await UsersTableTestHelper.cleanTable();

        await pool.end();
    });

    describe('addLike function', () => {
        it('should persist added like to a comment', async () => {
            // Arrange
            const idFaker = () => '1';

            const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, idFaker);

            // Action
            await likeRepositoryPostgres.addLike('user-123', 'comment-123');
            // return console.log(likeOri);

            // Assert
            const likes = await LikesTableTestHelper.findLikesByCommentId('comment-123');
            expect(likes.length).toBe(1);

            expect(likes[0].id).toBe('like-1');
        })
    });
});