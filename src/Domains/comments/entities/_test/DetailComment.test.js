const DetailComment = require('../DetailComment');

describe('a DetailComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'test-comment',
            date: 'test-date',
            content: 'test-content',
            replies: [],
            isDelete: 0,
        };

        expect(() => new DetailComment(payload)).toThrow(
            'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 1,
            replies: [],
            isDelete: 'not boolean',
            likeCount: 0,
        };

        expect(() => new DetailComment(payload)).toThrow(
            'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create DetailComment object correctly when isDeleted is false', () => {
        const payload = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 'test-content',
            replies: [],
            isDelete: false,
            likeCount: 0,
        };

        const {
            id, username, date, content, replies,
        } = new DetailComment(payload);

        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(content).toEqual(payload.content);
        expect(replies).toEqual(payload.replies);
    });

    it('should create CommentDetail object correctly when isDeleted is true', () => {
        const payload = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 'test-content',
            replies: [],
            isDelete: true,
            likeCount: 0,
        };

        const {
            id, username, date, content, replies,
        } = new DetailComment(payload);

        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(content).toEqual('**komentar telah dihapus**');
        expect(replies).toEqual(payload.replies);
    });

    it('should set replies to empty array when replies property is not provided', () => {
        const payload = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 'test-content',
            isDelete: false,
            likeCount: 0,
        };

        const { replies } = new DetailComment(payload);

        expect(replies).toStrictEqual([]);
    });

    it('should remap content correctly based on isDelete value', () => {
        const payloadWithDeleteTrue = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 'test-delete-comment',
            replies: [],
            isDelete: true,
            likeCount: 0,
        };

        const payloadWithDeleteFalse = {
            id: 'test-comment',
            username: 'test-user',
            date: 'test-date',
            content: 'test-content',
            replies: [],
            isDelete: false,
            likeCount: 0,
        };

        const deletedComment = new DetailComment(payloadWithDeleteTrue);
        const visibleComment = new DetailComment(payloadWithDeleteFalse);

        expect(deletedComment.content).toEqual('**komentar telah dihapus**');
        expect(visibleComment.content).toEqual(payloadWithDeleteFalse.content);
    });
});