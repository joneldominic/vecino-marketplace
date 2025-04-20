import { Schema } from 'mongoose';
export declare const AddressSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}>> & import("mongoose").FlatRecord<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const MoneySchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    amount: number;
    currency: "PHP";
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    amount: number;
    currency: "PHP";
}>> & import("mongoose").FlatRecord<{
    amount: number;
    currency: "PHP";
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const GeoLocationSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    latitude: number;
    longitude: number;
    radius?: number | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    latitude: number;
    longitude: number;
    radius?: number | undefined;
}>> & import("mongoose").FlatRecord<{
    latitude: number;
    longitude: number;
    radius?: number | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const ImageMetadataSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    url: string;
    isPrimary: boolean;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    url: string;
    isPrimary: boolean;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}>> & import("mongoose").FlatRecord<{
    url: string;
    isPrimary: boolean;
    alt?: string | undefined;
    width?: number | undefined;
    height?: number | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const ProductSpecificationSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    key: string;
    value: string;
    unit?: string | undefined;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    key: string;
    value: string;
    unit?: string | undefined;
}>> & import("mongoose").FlatRecord<{
    key: string;
    value: string;
    unit?: string | undefined;
}> & {
    _id: import("mongoose").Types.ObjectId;
}>;
