class LikeUseCase {
    constructor({ likeRepository, threadRepository, commentRepository }) {
        this._likeRepository = likeRepository;

        this._threadRepository = threadRepository;

        this._commentRepository = commentRepository;
    }

    async execute(userId, threadId, commentId) {
        await this._threadRepository.checkAvailableThread(threadId);

        await this._commentRepository.checkAvailableComment(commentId);

        const likeExists = await this._likeRepository.verifyLikeExists(userId, commentId);

        if (likeExists) {
            return this._likeRepository.deleteLike(userId, commentId);
        }

        return this._likeRepository.addLike(userId, commentId);
    }
}

module.exports = LikeUseCase;