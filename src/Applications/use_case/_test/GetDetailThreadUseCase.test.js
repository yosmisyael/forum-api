const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');

describe('GetDetailThreadUseCase', () => {
    it('should orchestrating the get thread detail action with comments and replies correctly', async () => {
        // Arrange
        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentRepository();

        const replyRepository = new ReplyRepository();

        const mockThreadData = {
            id: 'thread-123',
            title: 'test-thread',
            body: 'test-content',
            date: 'test-date-thread',
            username: 'george',
        };

        const mockCommentData = [
            {
                id: 'comment-123',
                username: 'angelina',
                date: 'test-date-comment-1',
                is_delete: false,
                content: 'Test comment one',
            },
            {
                id: 'comment-456',
                username: 'george',
                date: 'test-date-comment-2',
                is_delete: true,
                content: 'this is second comment on a thread',
            },
        ];

        const mockReplyData = [
            {
                id: 'reply-123',
                username: 'george',
                date: 'test-date-comment-1-reply1',
                is_delete: false,
                content: 'test-reply',
            },
            {
                id: 'reply-456',
                username: 'angelina',
                date: 'test-date-comment-1-reply2',
                is_delete: true,
                content: 'test second reply',
            },
        ];

        mockThreadRepository.getThreadById = jest
            .fn()
            .mockResolvedValue(mockThreadData);

        mockCommentRepository.getCommentByThreadId = jest
            .fn()
            .mockResolvedValue(mockCommentData);

        replyRepository.getRepliesByCommentId = jest
            .fn()
            .mockImplementation((commentId) => {
                if (commentId === 'comment-123') {
                  return Promise.resolve(mockReplyData);
                }
                return Promise.resolve([]);
            });

        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: replyRepository,
        });

        // Action
        const detailThread = await getDetailThreadUseCase.execute('thread-123');

        // Assert
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith('thread-123');

        expect(mockCommentRepository.getCommentByThreadId)
            .toHaveBeenCalledWith('thread-123');

        expect(replyRepository.getRepliesByCommentId)
            .toHaveBeenCalledWith('comment-123');

        expect(detailThread).toStrictEqual(new DetailThread({
            id: 'thread-123',
            title: 'test-thread',
            body: 'test-content',
            date: 'test-date-thread',
            username: 'george',
            comments: [
                new DetailComment({
                    id: 'comment-123',
                    content: 'Test comment one',
                    username: 'angelina',
                    date: 'test-date-comment-1',
                    isDelete: false,
                    replies: [
                        new DetailReply({
                            id: 'reply-123',
                            content: 'test-reply',
                            date: 'test-date-comment-1-reply1',
                            username: 'george',
                        }),
                        new DetailReply({
                            id: 'reply-456',
                            content: '**balasan telah dihapus**',
                            date: 'test-date-comment-1-reply2',
                            username: 'angelina',
                        }),
                    ],
                }),
                new DetailComment({
                    content: '**komentar telah dihapus**',
                    date: 'test-date-comment-2',
                    id: 'comment-456',
                    username: 'george',
                    isDelete: true,
                    replies: [],
                }),
            ],
        }));

        expect(detailThread.comments).toHaveLength(2);

        expect(detailThread.comments[0]).toStrictEqual(new DetailComment({
            id: 'comment-123',
            content: 'Test comment one',
            username: 'angelina',
            date: 'test-date-comment-1',
            isDelete: false,
            replies: [
                new DetailReply({
                    id: 'reply-123',
                    content: 'test-reply',
                    date: 'test-date-comment-1-reply1',
                    username: 'george',
                }),
                new DetailReply({
                    id: 'reply-456',
                    content: '**balasan telah dihapus**',
                    date: 'test-date-comment-1-reply2',
                    username: 'angelina',
                }),
            ],
        }),);

        expect(detailThread.comments[1]).toStrictEqual(new DetailComment({
            content: '**komentar telah dihapus**',
            date: 'test-date-comment-2',
            id: 'comment-456',
            username: 'george',
            isDelete: true,
            replies: [],
        }),);

        expect(detailThread.comments[0].replies).toHaveLength(2);

        expect(detailThread.comments[0].replies[0]).toStrictEqual(new DetailReply({
            id: 'reply-123',
            content: 'test-reply',
            date: 'test-date-comment-1-reply1',
            username: 'george',
        }));

        expect(detailThread.comments[0].replies[1]).toStrictEqual(new DetailReply({
            id: 'reply-456',
            content: '**balasan telah dihapus**',
            date: 'test-date-comment-1-reply2',
            username: 'angelina',
        }));

        expect(detailThread.comments[1].replies).toHaveLength(0);
    });

    it('should orchestrating the get thread detail action without comments and replies correctly', async () => {
        // Arrange
        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentRepository();

        const mockReplyRepository = new ReplyRepository();

        const mockThreadData = {
            id: 'thread-123',
            title: 'test-thread',
            body: 'test-content',
            date: 'test-date-thread',
            username: 'george',
        };

        mockThreadRepository.getThreadById = jest
            .fn()
            .mockResolvedValue(mockThreadData);

        mockCommentRepository.getCommentByThreadId = jest
            .fn()
            .mockResolvedValue([]);

        mockReplyRepository.getRepliesByCommentId = jest
            .fn()
            .mockResolvedValue([]);

        const getDetailThreadUseCase = new GetDetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const detailThread = await getDetailThreadUseCase.execute('thread-123');

        // Assert
        expect(mockThreadRepository.getThreadById)
            .toHaveBeenCalledWith('thread-123');

        expect(mockCommentRepository.getCommentByThreadId)
            .toHaveBeenCalledWith('thread-123');

        expect(mockReplyRepository.getRepliesByCommentId)
            .toHaveBeenCalledTimes(0);

        expect(detailThread).toStrictEqual(new DetailThread({
            id: 'thread-123',
            title: 'test-thread',
            body: 'test-content',
            date: 'test-date-thread',
            username: 'george',
            comments: []
        }));

        expect(detailThread.comments).toHaveLength(0);
    });
});
