const AddReply = require('../AddReply');

describe('an AddReply entities', () => {
    it('should throw error when payload did not contain right property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new AddReply(payload)).toThrow(
            'ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    })

    it('should throw error when payload contain wrong data type', () => {
        // Arrange
        const payload = {
            content: 1,
        };

        // Action and Assert
        expect(() => new AddReply(payload)).toThrow(
            'ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    })

    it('should create newReply object correctly', () => {
        // Arrange
        const payload = {
            content: 'test-content',
        }

        // Action
        const { content } = new AddReply(payload);

        // Assert
        expect(content).toStrictEqual(payload.content);
    })

});

