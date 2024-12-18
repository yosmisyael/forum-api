const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetDetailThreadUseCase {
    constructor({
                    threadRepository,
                    commentRepository,
                    replyRepository,
                }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async execute(threadId) {
        const { id, title, body, date, username } = await this._threadRepository.getThreadById(threadId);

        const thread = new DetailThread({
            id,
            title,
            body,
            date,
            username,
            comments: [],
        });

        const commentsInThread = await this._commentRepository.getCommentByThreadId(threadId);

        if (commentsInThread.length > 0) {
            const commentDetails = await Promise.all(
                commentsInThread.map(async (comment) => {
                    const commentDetail = new DetailComment({
                        id: comment.id,
                        username: comment.username,
                        date: comment.date,
                        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
                        replies: [],
                        isDelete: comment.is_delete,
                    });

                    const repliesInComment = await this._replyRepository.getRepliesByCommentId(
                        comment.id,
                    );

                    if (repliesInComment.length > 0) {
                        const replyDetails = await Promise.all(
                            repliesInComment.map(
                                async (reply) => new DetailReply({
                                    id: reply.id,
                                    content: reply.is_delete ? '**balasan telah dihapus**' : reply.content,
                                    date: reply.date,
                                    username: reply.username,
                                    isDelete: reply.is_delete,
                                }),
                            ),
                        );

                        commentDetail.replies.push(...replyDetails);
                    }

                    return commentDetail;
                }),
            );

            thread.comments.push(...commentDetails);
        }

        return thread;
    }
}

module.exports = GetDetailThreadUseCase;