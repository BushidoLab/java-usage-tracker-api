import { createWriteStream } from 'fs';
import * as mkdirp from 'mkdirp'
import * as shortid from 'shortid'
import { file } from '../db/models/File';
import { errorHandler } from '../errors/errorHandler';

const uploadDir = './uploads';
mkdirp.sync(uploadDir)

export class UploadService {
  static storeUpload = async ({ stream, fileName }): Promise<any> => {
    try {
      const id = shortid.generate()
      const path = `${uploadDir}/${id}-${fileName}`

      return new Promise((resolve, reject) =>
        stream
          .pipe(createWriteStream(path))
          .on('finish', () => resolve({ id, path }))
          .on('error', reject),
      )
    } catch (error) {
      throw errorHandler('StoreUploadError', {
        message: 'There was an error storing the upload',
        data: error.response.data.error
      });
    }
  }

  static recordFile = async ({ id, path, fileName, mimeType, encoding }) => {
    try {
      return file.create({
        id,
        path,
        fileName,
        mimeType,
        encoding,
      })
    } catch (error) {
      throw errorHandler('RecordFileError', {
        message: 'There was an error recording the file',
        data: error.response.data.error
      });
    }
  }

  static processUpload = async upload => {
    try {
      console.log(upload);
      const { stream, fileName, mimeType, encoding } = await upload
      const { id, path } = await UploadService.storeUpload({ stream, fileName })
      return UploadService.recordFile({ id, fileName, mimeType, encoding, path })
    } catch (error) {
      throw errorHandler('ProcessUploadError', {
        message: 'There was an error processing the upload',
        data: error.response.data.error
      });
    }
  }
}