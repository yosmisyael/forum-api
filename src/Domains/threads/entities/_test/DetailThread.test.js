const DetailThread = require('../DetailThread');

describe('a DetailThread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            id: 'test-thread-123',
            username: 'test-user-456',
        };

        expect(() => new DetailThread(payload)).toThrow(
            'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY',
        );
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 'test',
            title: 'test',
            body: 'test',
            date: 'test',
            username: 'test',
            comments: 'test',
        };

        expect(() => new DetailThread(payload)).toThrow(
            'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION',
        );
    });

    it('should create ThreadDetail object correctly', () => {
        const payload = {
            id: 'test',
            title: 'test',
            body: 'test',
            date: 'test',
            username: 'test',
            comments: [],
        };

        const {
            id, title, body, date, username, comments,
        } = new DetailThread(
            payload,
        );

        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
        expect(comments).toEqual(payload.comments);
    });
});