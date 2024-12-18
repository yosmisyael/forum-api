const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const mockUser = {
            id: 'test-user-1'
        };

        const mockThread = {
            id: 'test-thread-1'
        };

        const mockComment = {
            id: 'test-comment-1'
        };

        const mockCommentRepository = new CommentRepository();

        mockCommentRepository.checkAvailableComment = jest
            .fn(() => Promise.resolve());

        mockCommentRepository.verifyCommentOwner = jest
            .fn(() => Promise.resolve());

        mockCommentRepository.deleteCommentById = jest
            .fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action
        await deleteCommentUseCase.execute(
            mockThread.id,
            mockComment.id,
            mockUser.id,
        );

        // Assert
        expect(mockCommentRepository.checkAvailableComment).toHaveBeenCalledWith(mockComment.id);

        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(mockComment.id, mockUser.id);

        expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(mockThread.id, mockComment.id);
    })
})