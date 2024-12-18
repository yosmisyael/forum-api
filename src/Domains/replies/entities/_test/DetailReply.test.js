const DetailReply = require('../DetailReply');

describe('a DetailReply entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 'test-content',
            username: 'test-user-1',
        };

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrow('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 1,
            username: 'test-user-1',
            date: 'test-date',
        };

        // Action and Assert
        expect(() => new DetailReply(payload)).toThrow('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ReplyDetail object correctly when isDelete property is false', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 'test-content',
            username: 'test-user-1',
            date: 'test-date',
            isDelete: false,
        };

        // Action
        const { id, content, username, date } = new DetailReply(payload);

        // Assert
        expect(id).toStrictEqual(payload.id);
        expect(content).toStrictEqual(payload.content);
        expect(username).toStrictEqual(payload.username);
        expect(date).toStrictEqual(payload.date);
    });

    it('should create ReplyDetail object correctly when isDelete property is true', () => {
        // Arrange
        const payload = {
            id: 'test-reply-1',
            content: 'test-content',
            username: 'test-user-1',
            date: 'test-date',
            isDelete: true,
        };

        // Action
        const { id, content, username, date } = new DetailReply(payload);

        // Assert
        expect(id).toStrictEqual(payload.id);
        expect(content).toStrictEqual('**balasan telah dihapus**');
        expect(username).toStrictEqual(payload.username);
        expect(date).toStrictEqual(payload.date);
    })

});