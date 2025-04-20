"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseMongoDBRepository = void 0;
const mongoose_1 = require("mongoose");
class BaseMongoDBRepository {
    constructor(model, mapper) {
        this.model = model;
        this.mapper = mapper;
    }
    async findById(id) {
        const objectId = typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
        const document = await this.model.findById(objectId).exec();
        return document ? this.mapper.toDomain(document) : null;
    }
    async findAll(options) {
        const query = this.model.find();
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const documents = await query.exec();
        return documents.map(doc => this.mapper.toDomain(doc));
    }
    async findBy(criteria, options) {
        const persistenceCriteria = this.toPersistenceCriteria(criteria);
        const query = this.model.find(persistenceCriteria);
        if (options?.skip) {
            query.skip(options.skip);
        }
        if (options?.limit) {
            query.limit(options.limit);
        }
        const documents = await query.exec();
        return documents.map(doc => this.mapper.toDomain(doc));
    }
    async count(criteria) {
        if (!criteria) {
            return this.model.countDocuments().exec();
        }
        const persistenceCriteria = this.toPersistenceCriteria(criteria);
        return this.model.countDocuments(persistenceCriteria).exec();
    }
    async create(data) {
        const persistenceData = this.mapper.toPersistence(data);
        const savedDocument = await this.model.create(persistenceData);
        return this.mapper.toDomain(savedDocument);
    }
    async update(id, data) {
        const objectId = typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
        const persistenceData = this.mapper.toPersistence(data);
        const updatedDocument = await this.model
            .findByIdAndUpdate(objectId, { $set: persistenceData }, { new: true })
            .exec();
        return updatedDocument ? this.mapper.toDomain(updatedDocument) : null;
    }
    async delete(id) {
        const objectId = typeof id === 'string' ? new mongoose_1.Types.ObjectId(id) : id;
        const deletedDocument = await this.model.findByIdAndDelete(objectId).exec();
        return deletedDocument ? this.mapper.toDomain(deletedDocument) : null;
    }
    async deleteMany(criteria) {
        const persistenceCriteria = this.toPersistenceCriteria(criteria);
        const result = await this.model.deleteMany(persistenceCriteria).exec();
        return result.deletedCount;
    }
    toPersistenceCriteria(criteria) {
        if ('id' in criteria) {
            const idCriteria = criteria['id'];
            delete criteria['id'];
            return {
                ...this.mapper.toPersistence(criteria),
                _id: typeof idCriteria === 'string' ? new mongoose_1.Types.ObjectId(idCriteria) : idCriteria,
            };
        }
        return this.mapper.toPersistence(criteria);
    }
}
exports.BaseMongoDBRepository = BaseMongoDBRepository;
//# sourceMappingURL=base-mongodb.repository.js.map