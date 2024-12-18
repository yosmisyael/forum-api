const AddedReply = require('../AddedReply');

describe('an AddedReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload property did not meet data type needed', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 1,
            owner: 'test-user-1',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrow('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it('should create newReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 'test-content',
            owner: 'test-user-1',
        };

        // Action
        const { id, content, owner } = new AddedReply(payload);

        // Assert
        expect(id).toStrictEqual(payload.id);
        expect(content).toStrictEqual(payload.content);
        expect(owner).toStrictEqual(payload.owner);
    })
});