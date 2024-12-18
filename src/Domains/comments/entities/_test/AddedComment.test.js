const AddedComment = require('../AddedComment');

describe('an AddedComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test-thread',
            title: 'test-content',
            user: 'test-user',
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrow(
            'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload property did not meet data type needed', () => {
        // Arrange
        const payload = {
            id: 'test-thread',
            content: 'test-content',
            owner: 1,
        };

        // Action and Assert
        expect(() => new AddedComment(payload)).toThrow(
            'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create addedThread object correctly', () => {
        // Arrange
        const payload = {
            id: 'test-comment',
            content: 'test-content',
            owner: 'test-user',
        };

        // Action
        const addedComment = new AddedComment(payload);

        // Assert
        expect(addedComment.id).toStrictEqual(payload.id);
        expect(addedComment.content).toStrictEqual(payload.content);
        expect(addedComment.owner).toStrictEqual(payload.owner);
    });
});