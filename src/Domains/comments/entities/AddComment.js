class AddComment {
    constructor(paylaod) {
        this._verifyPayload(paylaod);

        const { content } = paylaod;

        this.content = content;
    }

    _verifyPayload(payload) {
        const { content } = payload;

        if (!content) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string') {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;
