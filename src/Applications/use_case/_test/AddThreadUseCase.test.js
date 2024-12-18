const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'test-title',
            body: 'test-body',
        };

        const mockUser = {
            id: 'test-user',
        };

        const expectedThread = new AddedThread({
            id: 'test-thread',
            title: useCasePayload.title,
            owner: mockUser.id,
        });

        const mockThreadRepository = new ThreadRepository();

        mockThreadRepository.addThread = jest.fn().mockResolvedValue(new AddedThread({
            id: 'test-thread',
            title: useCasePayload.title,
            owner: mockUser.id,
        }));

        const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });

        // Action
        const addedThread = await addThreadUseCase.execute(mockUser.id, useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(expectedThread);

        expect(mockThreadRepository.addThread).toHaveBeenCalledWith(mockUser.id, new AddThread(useCasePayload));
    });
});