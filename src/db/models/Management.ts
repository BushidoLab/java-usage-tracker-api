import { model, Schema } from 'mongoose';

const managementSchema = new Schema({
    license: { type: String, required: true },
    licenseType: { type: String, require: true },
    quantity: { type: Number, min: [1, `License quantity must be over one`], required: true },
    listFee: { type: Number, min: 1, required: true },
    discount: { type: Number },
    netFee: { type: Number },
    productSupportFee: { type: Number },
    softwareUpdateFee: { type: Number },
    otherFees: { type: Number },
    cdPackFee: { type: Number },
    unitPrice: { type: Number },
    supportDate: { type: String },
    user: { type: String }
});

export const management = model('management', managementSchema);
