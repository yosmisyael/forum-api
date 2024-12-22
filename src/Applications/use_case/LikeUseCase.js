
class LikeUseCase {
    constructor({ likeRepository, threadRepository, commentRepository }) {
        this._likeRepository = likeRepository;

        this._threadRepository = threadRepository;

        this._commentRepository = commentRepository;
    }

    async execute(userId, threadId, commentId) {

    }
}

module.exports = LikeUseCase;