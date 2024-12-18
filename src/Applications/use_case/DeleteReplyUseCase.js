class DeleteReplyUseCase {
    constructor({ replyRepository }) {
        this._replyRepository = replyRepository;
    }

    async execute(threadId, commentId, replyId, ownerId){
        await this._replyRepository.checkAvailableReply(replyId);

        await this._replyRepository.verifyReplyOwner(replyId, ownerId);

        return this._replyRepository.deleteReplyById(threadId, commentId, replyId);
    }
}

module.exports = DeleteReplyUseCase;