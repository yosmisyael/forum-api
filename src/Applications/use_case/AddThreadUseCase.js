const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this.threadRepository = threadRepository;
    }

    async execute(ownerId, useCasePayload) {
        const addThread = new AddThread(useCasePayload);

        return this.threadRepository.addThread(ownerId, addThread);
    }
}

module.exports = AddThreadUseCase;