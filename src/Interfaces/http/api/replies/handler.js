const autoBind = require('auto-bind');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class ReplyHandler {
    constructor(container) {
        this._container = container;

        autoBind(this);
    }

    async postReplyHandler(request, h) {
        const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);

        const { id: ownerId } = request.auth.credentials;

        const { threadId, commentId } = request.params;

        const addedReply = await addReplyUseCase.execute(
            threadId,
            commentId,
            ownerId,
            request.payload,
        );

        const response = h.response({
            status: 'success',
            data: { addedReply },
        });

        response.code(201);

        return response;
    }

    async deleteReplyByIdHandler(request, h) {
        const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);

        const { id: ownerId } = request.auth.credentials;
        const { threadId, commentId, replyId } = request.params;

        await deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId);

        return h.response({
            status: 'success',
        });
    }
}

module.exports = ReplyHandler;