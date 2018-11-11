import * as multer from 'multer';
import { Router } from 'express';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { ManagementService } from '../services/managementService';

const router = Router();
const upload = multer({ dest: 'tmp/csv' });

router.post('/', upload.single('file'), (req, res) => {
  console.log(req);
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
        licenseType: row[3],
        quantity: row[4],
        listFee: row[5],
        discount: row[6],
        productSupportFee: row[7],
        supportDate: null,
        softwareUpdateFee: row[8],
        otherFees: row[9],
        cdPackFee: row[10],
        unitPrice: null,
        user: null
      });
  });
};

export default router;
