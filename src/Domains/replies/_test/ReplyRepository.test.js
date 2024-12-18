const ReplyCommentRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        const replyCommentRepository = new ReplyCommentRepository();

        await expect(replyCommentRepository.addReply('', '', {})).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(replyCommentRepository.getRepliesByCommentId('')).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(replyCommentRepository.deleteReplyById('')).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(replyCommentRepository.verifyReplyOwner('', '')).rejects.toThrow(
            'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED',
        );
        await expect(
            replyCommentRepository.checkAvailableReply(''),
        ).rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});