const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const threadRepository = new ThreadRepository();

        // Action and Assert
        await expect(threadRepository.addThread('', '')).rejects.toThrow(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(threadRepository.checkAvailableThread('', '')).rejects.toThrow(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(threadRepository.getThreadById('', '')).rejects.toThrow(
            'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
    })
});