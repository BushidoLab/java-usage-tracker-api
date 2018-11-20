import * as multer from 'multer';
import { Router } from 'express';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { ManagementService } from '../services/managementService';

const router = Router();
const upload = multer({ dest: 'tmp/csv' });

router.post('/', upload.single('file'), (req, res) => {
  const fileRows = [];
  csv
    .fromPath(req.file.path)
    .on('data', data => {
      fileRows.push(data);
    })
    .on('end', () => {
      createManagementFromCsv({ fileRows })
      fs.unlinkSync(req.file.path);
      res.send('200');
    });
});

const createManagementFromCsv = ({ fileRows }) => {
  fileRows.forEach((row, index) => {
    index !== 0 &&
      ManagementService.manage({
        csi: row[2],
        license: row[3],
        vendor: row[4],
        vendorNumber: row[5],
        licenseType: row[6],
        version: row[7],
        supportDate: row[8],
        quantity: row[9],
        listFee: row[10],
        discount: row[11],
        productSupportFee: row[12],
        softwareUpdateFee: row[13],
        otherFees: row[14],
        cdPackFee: row[15],
        unitPrice: null,
        user: null
      });
  });
};

export default router;
