"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
class MockBaseRepository {
    findById(_id) {
        return Promise.resolve(null);
    }
    findAll() {
        return Promise.resolve([]);
    }
    findBy(_criteria) {
        return Promise.resolve([]);
    }
    count() {
        return Promise.resolve(0);
    }
    create(_data) {
        return Promise.resolve({});
    }
    update(_id, _data) {
        return Promise.resolve(null);
    }
    delete(_id) {
        return Promise.resolve(null);
    }
    deleteMany(_criteria) {
        return Promise.resolve(0);
    }
}
class MockUserRepository extends MockBaseRepository {
    findByEmail(_email) {
        return Promise.resolve(null);
    }
    findByRole(_role) {
        return Promise.resolve([]);
    }
    updatePassword(_id, _passwordHash) {
        return Promise.resolve(null);
    }
}
class MockProductRepository extends MockBaseRepository {
    findBySeller(_sellerId) {
        return Promise.resolve([]);
    }
    findByCategory(_categoryId) {
        return Promise.resolve([]);
    }
    search(_query) {
        return Promise.resolve([]);
    }
    findByStatus(_status) {
        return Promise.resolve([]);
    }
    findByLocation(_location) {
        return Promise.resolve([]);
    }
    updateStatus(_id, _status) {
        return Promise.resolve(null);
    }
    addImage(_id, _imageUrl) {
        return Promise.resolve(null);
    }
    removeImage(_id, _imageUrl) {
        return Promise.resolve(null);
    }
}
class MockOrderRepository extends MockBaseRepository {
    findByBuyer(_buyerId) {
        return Promise.resolve([]);
    }
    findBySeller(_sellerId) {
        return Promise.resolve([]);
    }
    findByStatus(_status) {
        return Promise.resolve([]);
    }
    findByProduct(_productId) {
        return Promise.resolve([]);
    }
    updateStatus(_id, _status) {
        return Promise.resolve(null);
    }
}
class MockConversationRepository extends MockBaseRepository {
    findByParticipant(_userId) {
        return Promise.resolve([]);
    }
    findByProduct(_productId) {
        return Promise.resolve([]);
    }
    findOrCreate(_participantIds) {
        return Promise.resolve({});
    }
    getMessages(_conversationId) {
        return Promise.resolve([]);
    }
    addMessage(_conversationId, _message) {
        return Promise.resolve({});
    }
    markMessagesAsRead(_conversationId, _userId) {
        return Promise.resolve(0);
    }
}
(0, globals_1.describe)('Repository Interfaces', () => {
    (0, globals_1.describe)('Base Repository Interface', () => {
        (0, globals_1.it)('should allow implementation of all required methods', () => {
            const repo = new MockBaseRepository();
            (0, globals_1.expect)(repo.findById).toBeDefined();
            (0, globals_1.expect)(repo.findAll).toBeDefined();
            (0, globals_1.expect)(repo.findBy).toBeDefined();
            (0, globals_1.expect)(repo.count).toBeDefined();
            (0, globals_1.expect)(repo.create).toBeDefined();
            (0, globals_1.expect)(repo.update).toBeDefined();
            (0, globals_1.expect)(repo.delete).toBeDefined();
            (0, globals_1.expect)(repo.deleteMany).toBeDefined();
            (0, globals_1.expect)(repo.findById('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findAll()).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findBy({})).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.count()).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.create({})).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.update('1', {})).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.delete('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.deleteMany({})).toBeInstanceOf(Promise);
        });
    });
    (0, globals_1.describe)('User Repository Interface', () => {
        (0, globals_1.it)('should allow implementation of all required methods', () => {
            const repo = new MockUserRepository();
            (0, globals_1.expect)(repo.findById).toBeDefined();
            (0, globals_1.expect)(repo.findAll).toBeDefined();
            (0, globals_1.expect)(repo.findBy).toBeDefined();
            (0, globals_1.expect)(repo.count).toBeDefined();
            (0, globals_1.expect)(repo.create).toBeDefined();
            (0, globals_1.expect)(repo.update).toBeDefined();
            (0, globals_1.expect)(repo.delete).toBeDefined();
            (0, globals_1.expect)(repo.deleteMany).toBeDefined();
            (0, globals_1.expect)(repo.findByEmail).toBeDefined();
            (0, globals_1.expect)(repo.findByRole).toBeDefined();
            (0, globals_1.expect)(repo.updatePassword).toBeDefined();
            (0, globals_1.expect)(repo.findByEmail('test@example.com')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByRole('buyer')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.updatePassword('1', 'hash')).toBeInstanceOf(Promise);
        });
    });
    (0, globals_1.describe)('Product Repository Interface', () => {
        (0, globals_1.it)('should allow implementation of all required methods', () => {
            const repo = new MockProductRepository();
            (0, globals_1.expect)(repo.findById).toBeDefined();
            (0, globals_1.expect)(repo.findAll).toBeDefined();
            (0, globals_1.expect)(repo.findBy).toBeDefined();
            (0, globals_1.expect)(repo.count).toBeDefined();
            (0, globals_1.expect)(repo.create).toBeDefined();
            (0, globals_1.expect)(repo.update).toBeDefined();
            (0, globals_1.expect)(repo.delete).toBeDefined();
            (0, globals_1.expect)(repo.deleteMany).toBeDefined();
            (0, globals_1.expect)(repo.findBySeller).toBeDefined();
            (0, globals_1.expect)(repo.findByCategory).toBeDefined();
            (0, globals_1.expect)(repo.search).toBeDefined();
            (0, globals_1.expect)(repo.findByStatus).toBeDefined();
            (0, globals_1.expect)(repo.findByLocation).toBeDefined();
            (0, globals_1.expect)(repo.updateStatus).toBeDefined();
            (0, globals_1.expect)(repo.addImage).toBeDefined();
            (0, globals_1.expect)(repo.removeImage).toBeDefined();
            (0, globals_1.expect)(repo.findBySeller('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByCategory('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.search('test')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByStatus('active')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByLocation({ latitude: 0, longitude: 0 })).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.updateStatus('1', 'active')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.addImage('1', 'image.jpg')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.removeImage('1', 'image.jpg')).toBeInstanceOf(Promise);
        });
    });
    (0, globals_1.describe)('Order Repository Interface', () => {
        (0, globals_1.it)('should allow implementation of all required methods', () => {
            const repo = new MockOrderRepository();
            (0, globals_1.expect)(repo.findById).toBeDefined();
            (0, globals_1.expect)(repo.findAll).toBeDefined();
            (0, globals_1.expect)(repo.findBy).toBeDefined();
            (0, globals_1.expect)(repo.count).toBeDefined();
            (0, globals_1.expect)(repo.create).toBeDefined();
            (0, globals_1.expect)(repo.update).toBeDefined();
            (0, globals_1.expect)(repo.delete).toBeDefined();
            (0, globals_1.expect)(repo.deleteMany).toBeDefined();
            (0, globals_1.expect)(repo.findByBuyer).toBeDefined();
            (0, globals_1.expect)(repo.findBySeller).toBeDefined();
            (0, globals_1.expect)(repo.findByStatus).toBeDefined();
            (0, globals_1.expect)(repo.findByProduct).toBeDefined();
            (0, globals_1.expect)(repo.updateStatus).toBeDefined();
            (0, globals_1.expect)(repo.findByBuyer('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findBySeller('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByStatus('created')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByProduct('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.updateStatus('1', 'paid')).toBeInstanceOf(Promise);
        });
    });
    (0, globals_1.describe)('Conversation Repository Interface', () => {
        (0, globals_1.it)('should allow implementation of all required methods', () => {
            const repo = new MockConversationRepository();
            (0, globals_1.expect)(repo.findById).toBeDefined();
            (0, globals_1.expect)(repo.findAll).toBeDefined();
            (0, globals_1.expect)(repo.findBy).toBeDefined();
            (0, globals_1.expect)(repo.count).toBeDefined();
            (0, globals_1.expect)(repo.create).toBeDefined();
            (0, globals_1.expect)(repo.update).toBeDefined();
            (0, globals_1.expect)(repo.delete).toBeDefined();
            (0, globals_1.expect)(repo.deleteMany).toBeDefined();
            (0, globals_1.expect)(repo.findByParticipant).toBeDefined();
            (0, globals_1.expect)(repo.findByProduct).toBeDefined();
            (0, globals_1.expect)(repo.findOrCreate).toBeDefined();
            (0, globals_1.expect)(repo.getMessages).toBeDefined();
            (0, globals_1.expect)(repo.addMessage).toBeDefined();
            (0, globals_1.expect)(repo.markMessagesAsRead).toBeDefined();
            (0, globals_1.expect)(repo.findByParticipant('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findByProduct('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.findOrCreate(['1', '2'])).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.getMessages('1')).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.addMessage('1', { senderId: '1', recipientId: '2', content: 'test', read: false })).toBeInstanceOf(Promise);
            (0, globals_1.expect)(repo.markMessagesAsRead('1', '2')).toBeInstanceOf(Promise);
        });
    });
});
//# sourceMappingURL=repository-interfaces.test.js.map