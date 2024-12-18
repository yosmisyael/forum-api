class DetailComment {
    constructor(payload) {
        this. _verifyPayload(payload);

        const {
            id, username, date, content, replies,
        } = this._remapPayload(payload);

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.replies = replies;
    }

    _verifyPayload({
                       id,
                       username,
                       date,
                       content,
                       replies = [],
                       isDelete,
                   }) {
        if (
            !id
            || !username
            || !date
            || !content
            || !replies
            || isDelete === undefined
        ) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string'
            || typeof username !== 'string'
            || typeof date !== 'string'
            || typeof content !== 'string'
            || typeof isDelete !== 'boolean'
            || !Array.isArray(replies)
        ) {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

    _remapPayload({
                      id,
                      username,
                      date,
                      content,
                      replies = [],
                      isDelete,
                  }) {
        return {
            id,
            username,
            date,
            content: isDelete ? '**komentar telah dihapus**' : content,
            replies,
        };
    }
}

module.exports = DetailComment;