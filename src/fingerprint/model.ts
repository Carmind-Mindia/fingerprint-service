import { Type, type Static } from '@sinclair/typebox';
import mongoose, { Schema } from "mongoose";

const TFingerprint = Type.Object({
    dni: Type.String(),
    template: Type.String(),
    fingerIndex: Type.Number(),
    lastDateVerified: Type.Date()
})

export type IFingerprint = Static<typeof TFingerprint>

const fingerprintSchema = new Schema<IFingerprint>({
    dni: { type: String, required: true },
    template: { type: String, required: true },
    fingerIndex: { type: Number, required: true },
    lastDateVerified: { type: Date, required: true }
}, {
    versionKey: false
});

export const Fingerprint = mongoose.model<IFingerprint>('fingerprints', fingerprintSchema);

