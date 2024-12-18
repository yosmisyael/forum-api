const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddReplyUseCase = require("../AddReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");


describe('AddReplyUseCase', () => {
    it('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'test-content',
        };

        const mockUser = {
            id: 'test-user-1',
        };

        const mockThread = {
            id: 'test-thread-1',
        };

        const mockComment = {
            id: 'test-comment-1',
        };

        const expectedReply = new AddedReply({
            id: 'test-reply-1',
            content: useCasePayload.content,
            owner: mockUser.id,
        })

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.checkAvailableThread = jest.fn(() => Promise.resolve());

        mockCommentRepository.checkAvailableComment = jest.fn(() => Promise.resolve());

        mockReplyRepository.addReply = jest.fn().mockResolvedValue(new AddedReply({
            id: 'test-reply-1',
            content: useCasePayload.content,
            owner: mockUser.id,
        }));

        const addReplyUseCase = new AddReplyUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const addedReply = await addReplyUseCase.execute(
            mockThread.id,
            mockComment.id,
            mockUser.id,
            useCasePayload,
        );

        // Assert
        expect(addedReply).toStrictEqual(expectedReply);

        expect(mockThreadRepository.checkAvailableThread).toHaveBeenCalledWith(mockThread.id);

        expect(mockCommentRepository.checkAvailableComment).toHaveBeenCalledWith(mockComment.id);

        expect(mockReplyRepository.addReply).toHaveBeenCalledWith(
            mockUser.id,
            mockComment.id,
            new AddReply({
            content: useCasePayload.content,
            }),
        );
    })
})