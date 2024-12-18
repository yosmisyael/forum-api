const AddComment = require('../AddComment');

describe('an AddComment entities', () => {
    it('should throw error when payload did not contain right property', () => {
        // Arrange
        const payload = {};

        // Action and Assert
        expect(() => new AddComment(payload)).toThrow(
            'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload contain wrong data type', () => {
        // Arrange
        const payload = {
            content: 1,
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrow(
            'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create newComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'test content',
        };

        // Action
        const newComment = new AddComment(payload);

        // Assert
        expect(newComment.content).toStrictEqual(payload.content);
    });
});