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
        license: row[2],
        vendor: row[3],
        licenseType: row[4],
        version: row[5],
        quantity: row[6],
        listFee: row[7],
        discount: row[8],
        productSupportFee: row[9],
        supportDate: null,
        softwareUpdateFee: row[10],
        otherFees: row[11],
        cdPackFee: row[12],
        unitPrice: null,
        csi: row[13],
        vendorNumber: row[14],
        user: null
      });
  });
};

export default router;
