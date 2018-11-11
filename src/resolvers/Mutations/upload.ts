import { UploadService } from '../../services/uploadService';

export const upload = {
  async singleUpload(_, { file }) {
    return UploadService.processUpload(file);
  }
};
