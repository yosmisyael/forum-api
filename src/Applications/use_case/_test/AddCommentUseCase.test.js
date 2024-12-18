const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'test-content',
        };

        const mockThread = {
            id: 'test-thread-1',
        };

        const mockUser = {
            id: 'test-user-1',
        };

        const expectedComment = new AddedComment({
            id: 'test-comment-1',
            content: useCasePayload.content,
            owner: mockUser.id,
        });

        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.checkAvailableThread = jest.fn(() => Promise.resolve());

        mockCommentRepository.addComment = jest.fn().mockResolvedValue(new AddedComment({
            id: 'test-comment-1',
            content: useCasePayload.content,
            owner: mockUser.id,
        }));

        const addCommentUseCase = new AddCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        const addedComment = await addCommentUseCase.execute(
            mockThread.id,
            mockUser.id,
            useCasePayload,
        );

        // Assert
        expect(addedComment).toStrictEqual(expectedComment);

        expect(mockThreadRepository.checkAvailableThread).toHaveBeenCalledWith(mockThread.id);

        expect(mockCommentRepository.addComment).toHaveBeenCalledWith(
            mockThread.id,
            mockUser.id,
            new AddComment(useCasePayload),
        );
    });
});