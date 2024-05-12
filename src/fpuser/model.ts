import { Type, type Static } from '@sinclair/typebox';
import mongoose, { Schema } from "mongoose";



const TFP_User = Type.Object({
    dni: Type.String(),
    name: Type.String(),
    lastName: Type.String(),
    fingerprints: Type.Optional(Type.Array(Type.Object({
        template: Type.String(),
        fingerIndex: Type.Number()
    }))),
    lastDateVerified: Type.Optional(Type.Date()),
    loginId: Type.Optional(Type.String()),
    active: Type.Optional(Type.Boolean({default: true}))
})

export type IFP_User = Static<typeof TFP_User>

const FPUserSchema = new Schema<IFP_User>({
    dni: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    fingerprints: [{
        template: { type: String, required: true },
        fingerIndex: { type: Number, required: true }
    }],
    lastDateVerified: { type: Date, required: false },
    loginId: { type: String, required: false },
    active: { type: Boolean, required: true, default: true }
}, {
    versionKey: false
});

export const FPUser = mongoose.model<IFP_User>('fpuser', FPUserSchema);
