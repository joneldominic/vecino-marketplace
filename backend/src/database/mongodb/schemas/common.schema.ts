import { Schema } from 'mongoose';

/**
 * Address schema - common structure for storing location data
 */
export const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

/**
 * Money schema - common structure for monetary values
 */
export const MoneySchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'PHP', enum: ['PHP'] },
  },
  { _id: false },
);

/**
 * GeoLocation schema - common structure for geographical data
 */
export const GeoLocationSchema = new Schema(
  {
    latitude: { type: Number, required: true, min: -90, max: 90 },
    longitude: { type: Number, required: true, min: -180, max: 180 },
    radius: { type: Number, min: 0 }, // Optional radius in km
  },
  { _id: false },
);

/**
 * ImageMetadata schema - common structure for image data
 */
export const ImageMetadataSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

/**
 * ProductSpecification schema - common structure for product attributes
 */
export const ProductSpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    unit: { type: String },
  },
  { _id: false },
);
