const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");


describe('DeleteReplyUseCase', () => {
    it('should orchestrating the delete reply use case correctly', async () => {
        // Arrange
        const mockReplyRepository = new ReplyRepository();

        const mockUser = {
            id: 'test-user-1',
        };

        const mockThread = {
            id: 'test-thread-1',
        };

        const mockComment = {
            id: 'test-comment-1',
        };

        const mockReply = {
            id: 'test-reply-1',
        };

        mockReplyRepository.checkAvailableReply = jest
            .fn(() => Promise.resolve());

        mockReplyRepository.verifyReplyOwner = jest
            .fn(() => Promise.resolve());

        mockReplyRepository.deleteReplyById = jest
            .fn(() => Promise.resolve());

        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
        });

        // Action
        await deleteReplyUseCase.execute(
            mockThread.id,
            mockComment.id,
            mockReply.id,
            mockUser.id,
        )

        // Assert
        expect(mockReplyRepository.checkAvailableReply).toHaveBeenCalledWith(mockReply.id);

        expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(mockReply.id, mockUser.id);

        expect(mockReplyRepository.deleteReplyById).toHaveBeenCalledWith(
            mockThread.id,
            mockComment.id,
            mockReply.id,
        );
    });
});