const autoBind = require('auto-bind');
const LikeUseCase = require('../../../../Applications/use_case/LikeUseCase');

class LikeHandler {
     constructor(container) {
         this._container = container;

         autoBind(this);
     }

     async putLikeHandler(request, h) {
         const likeUseCase = this._container.getInstance(LikeUseCase.name);

         const { id: ownerId } = request.auth.credentials;

         const { threadId, commentId } = request.params;

         await likeUseCase.execute(ownerId, threadId, commentId);

         const response = h.response({
             status: 'success',
         });

         response.statusCode = 200;

         return response;
     }
}

module.exports = LikeHandler;