const AddThread = require('../AddThread');

describe('an AddThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'title only',
        }

        // Action and Assert
        expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 3.14,
            body: 'test',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrow('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create registeredUser object correctly', () => {
        // Arrange
        const payload = {
            title: 'test',
            body: 'test',
        };

        // Action
        const { title, body } = new AddThread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
    });
});