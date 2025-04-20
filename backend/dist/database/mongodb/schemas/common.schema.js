"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSpecificationSchema = exports.ImageMetadataSchema = exports.GeoLocationSchema = exports.MoneySchema = exports.AddressSchema = void 0;
const mongoose_1 = require("mongoose");
exports.AddressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });
exports.MoneySchema = new mongoose_1.Schema({
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'PHP', enum: ['PHP'] },
}, { _id: false });
exports.GeoLocationSchema = new mongoose_1.Schema({
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    radius: { type: Number, min: 0 },
}, { _id: false });
exports.ImageMetadataSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    alt: { type: String },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    isPrimary: { type: Boolean, default: false },
}, { _id: false });
exports.ProductSpecificationSchema = new mongoose_1.Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String },
}, { _id: false });
//# sourceMappingURL=common.schema.js.map