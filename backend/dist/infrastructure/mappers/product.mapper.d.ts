import { Product as ProductEntity } from '../../domain/models/domain-model';
import { Product as ProductModel } from '../../database/mongodb/schemas/product.schema';
import { BaseMapper } from './base.mapper';
export declare class ProductMapper implements BaseMapper<ProductEntity, ProductModel> {
    toDomain(model: ProductModel): ProductEntity;
    toPersistence(entity: ProductEntity): Partial<ProductModel>;
    private convertToObjectId;
    private convertToMoney;
    private convertToGeoLocation;
    private convertToSpecifications;
    private convertToImages;
    private getIdAsString;
}
