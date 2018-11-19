import { management } from '../db/models/Management';
import { LogService } from './logService';

function countDownTimer(supportDate) {
  var strDate = new Date(supportDate);

  // Adds a year to date passed as param
  const expireDate = new Date(strDate).getTime() + 31540000000;
  const distance = expireDate - Date.now();
  if (distance < 0) {
    return "Expired";
  }
  return new Date(expireDate).toString();
}

export class ReconcileService {
  static async getReconcile() {
    // let userEmail = await MailerService.getEmail({ email })
    let audit = await LogService.queryAllLogs();
    let manageForms:Array<any> = await management.find();
    let reconcileArr = [];

    manageForms.forEach(form => {
      form.license = form.license;
      
      // Creates an object fitting the reconciliation grid
      let obj = {
        productName: String(),
        licenseType: String(),
        version: String(),
        quantity: Number(),
        supported: String(),
        inventory: Number(),
        difference: Number(),
        amount: Number(),
      };

      let logCount = 0;
      audit.forEach(log => {
        // Counts the object in managements that matches a logs product name, license type and version number
        if (form.license === log.product && form.licenseType === log.category && form.version === log.version) {
            logCount++;
            obj.productName = form.license;
            obj.licenseType = form.licenseType;
            obj.version = log.version;
        }
          
      })
      obj.quantity = form.quantity;

      if (form.productSupportFee > 0) {
        let date = countDownTimer(form.supportDate);
        if (date.includes(":")) {
          obj.supported = date.substring(0, date.indexOf(":") - 2)
        } else {
          obj.supported = date;
        }
      } else {
        obj.supported = "No support";
      }

      obj.inventory = logCount;
      obj.difference = obj.quantity - obj.inventory;
      if (obj.difference < 0) {
        obj.amount = -obj.difference * form.unitPrice;
      } else {
        obj.amount = 0;
      }
      reconcileArr.push(obj);
    })
    return reconcileArr;
  }
}