const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
    constructor({ commentRepository, threadRepository, replyRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId, commentId, ownerId, useCasePayload){
        const addReply = new AddReply(useCasePayload);

        await this._threadRepository.checkAvailableThread(threadId);

        await this._commentRepository.checkAvailableComment(commentId);

        return this._replyRepository.addReply(ownerId, commentId, addReply);
    }
}

module.exports = AddReplyUseCase;