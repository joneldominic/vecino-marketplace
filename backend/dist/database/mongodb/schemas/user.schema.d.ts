import { Document } from 'mongoose';
import { UserRole } from '../../../domain/models/domain-model';
export declare class User extends Document {
    email: string;
    name: string;
    passwordHash: string;
    role: UserRole;
    address?: Record<string, any>;
    phone?: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
}>;
export declare const USER_MODEL: string;
