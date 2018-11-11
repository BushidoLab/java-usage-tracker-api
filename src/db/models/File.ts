import { model, Schema } from 'mongoose';

const fileSchema = new Schema({
    id: { type: String, required: true },
    path: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    encoding: { type: String, required: true },
});

export const file = model('file', fileSchema);