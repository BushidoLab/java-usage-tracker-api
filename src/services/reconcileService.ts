import { management } from '../db/models/Management';
import { LogService } from './logService';

function countDownTimer(supportDate) {
  var strDate = new Date(supportDate);
  // Adds a year to date passed as param
  const expireDate = new Date(strDate).getTime() + 31540000000;
  const distance = expireDate - Date.now();
  if (distance < 0) {
    return "Expired"
  }
  return new Date(expireDate).toString();
}

export class ReconcileService {
  static async getReconcile() {
    let audit = await LogService.queryAllProcLogs();
    let manageForms:Array<any> = await management.find();
    let reconcileArr = [];

    manageForms.forEach(form => {
      form.license = form.license
      // Creates an object fitting the reconciliation grid
      let obj = {
        productName: String(),
        licenseType: String(),
        quantity: Number(),
        supported: String(),
        inventory: Number(),
        difference: Number(),
        amount: Number(),
      };
      let logCount = 0;
      audit.forEach(log => {
        if (form.license == log.product) {
          logCount++;
        }
        obj.productName = form.license;
        obj.licenseType = form.licenseType;
      })
      obj.quantity = form.quantity;
      if (form.productSupportFee > 0) {
        let date = countDownTimer(form.supportDate);
        obj.supported = date.substring(0, date.indexOf(":") - 2)
      } else {
        obj.supported = "No support";
      }
      obj.inventory = logCount;
      obj.difference = obj.quantity - obj.inventory;
      if (obj.difference < 0) {
        obj.amount = obj.difference * form.unitPrice;
      } else {
        obj.amount = obj.difference * form.unitPrice;
      }
      reconcileArr.push(obj);
    })
    return reconcileArr;
  }
}