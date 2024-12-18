const AddedThread = require('../AddedThread');

describe('an AddedThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'title only',
        }

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'test-thread-123',
            title: 3.14,
            owner: 'test-user-123',
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrow('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create registeredUser object correctly', () => {
        // Arrange
        const payload = {
            id: 'test-thread-123',
            title: 'test-thread-123',
            owner: 'test-user-123',
        };

        // Action
        const { id, title, owner } = new AddedThread(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
    });
});