import { management } from '../db/models/Management';
import { LogService } from './logService';

function countDownTimer(supportDate) {
  const countDownDate = new Date("January 25, 2019 15:37:25").getTime();
  const distance = countDownDate - supportDate;

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  var result = `${days}d ${hours}h ${minutes}m`;
  if (distance < 0) {
    return "No support"
  }
  return result;
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
        obj.supported = countDownTimer(Date.now());
      } else {
        obj.supported = "No support";
      }
      obj.inventory = logCount;
      obj.difference = obj.quantity - obj.inventory;
      if (obj.difference < 0) {
        obj.amount = obj.difference * form.unitPrice;
      } else {
        obj.amount = 0;
      }
      reconcileArr.push(obj);
    })
    return reconcileArr;
  }
}