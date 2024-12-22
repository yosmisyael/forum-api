const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeUseCase = require('../LikeUseCase');

describe('LikeUseCase', () => {
    it('should orchestrating the add like comment action correctly', async () => {
        // Arrange
        const mockUser = {
            id: 'test-user-1',
        };

        const mockThread = {
            id: 'test-thread-1',
        }

        const mockComment = {
            id: 'test-comment-1',
        };

        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentRepository();

        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.checkAvailableThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.checkAvailableComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockLikeRepository.verifyLikeExists = jest
            .fn()
            .mockResolvedValue(false);

        mockLikeRepository.addLike = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockLikeRepository.deleteLike = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await likeUseCase.execute(
            mockUser.id,
            mockThread.id,
            mockComment.id,
        );

        // Assert
        expect(mockThreadRepository.checkAvailableThread).toHaveBeenCalledWith(mockThread.id);

        expect(mockCommentRepository.checkAvailableComment).toHaveBeenCalledWith(mockComment.id);

        expect(mockLikeRepository.verifyLikeExists).toHaveBeenCalledWith(mockUser.id, mockComment.id);

        expect(mockLikeRepository.deleteLike).not.toHaveBeenCalled();

        expect(mockLikeRepository.addLike).toHaveBeenCalledWith(mockUser.id, mockComment.id);
    });

    it('should orchestrating the delete like comment action correctly', async () => {
        // Arrange
        const mockUser = {
            id: 'test-user-1',
        };

        const mockThread = {
            id: 'test-thread-1',
        }

        const mockComment = {
            id: 'test-comment-1',
        };

        const mockThreadRepository = new ThreadRepository();

        const mockCommentRepository = new CommentRepository();

        const mockLikeRepository = new LikeRepository();

        mockThreadRepository.checkAvailableThread = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockCommentRepository.checkAvailableComment = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockLikeRepository.verifyLikeExists = jest
            .fn()
            .mockResolvedValue(true);

        mockLikeRepository.addLike = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        mockLikeRepository.deleteLike = jest
            .fn()
            .mockImplementation(() => Promise.resolve());

        const likeUseCase = new LikeUseCase({
            likeRepository: mockLikeRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });

        // Action
        await likeUseCase.execute(
            mockUser.id,
            mockThread.id,
            mockComment.id,
        );

        // Assert
        expect(mockThreadRepository.checkAvailableThread).toHaveBeenCalledWith(mockThread.id);

        expect(mockCommentRepository.checkAvailableComment).toHaveBeenCalledWith(mockComment.id);

        expect(mockLikeRepository.verifyLikeExists).toHaveBeenCalledWith(mockUser.id, mockComment.id);

        expect(mockLikeRepository.addLike).not.toHaveBeenCalled();

        expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(mockUser.id, mockComment.id);
    });
});