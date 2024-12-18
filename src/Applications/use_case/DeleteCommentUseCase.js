class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute(threadId, commentId, ownerId) {
        await this._commentRepository.checkAvailableComment(commentId);

        await this._commentRepository.verifyCommentOwner(commentId, ownerId);

        return this._commentRepository.deleteCommentById(threadId, commentId);
    }
}

module.exports = DeleteCommentUseCase;