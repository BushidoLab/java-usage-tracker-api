import axios from 'axios';
import { management } from '../db/models/Management';
import { errorHandler } from '../errors/errorHandler';
require('dotenv').config();

let manageForms;
const channel = "default";
const NUPChaincode = "NUPChaincode";
const ProcChaincode = "ProcessorChaincode";
const chaincodeVer = "1.0";

export class ReconcileService {
  static async getReconcile() {
    const procData = {
      channel,
      chaincode: ProcChaincode,
      chaincodeVer,
      method: "query",
      args: ["oracle"]
    };
    const nupData = {
      channel,
      chaincode: NUPChaincode,
      chaincodeVer,
      method: "query",
      args: ["oracle"]
    }
    try {
      const procResponse = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      procData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      const procLogs = procResponse.data.result.payload;
      
      const nupResponse = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      nupData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      const nupLogs = nupResponse.data.result.payload;

      manageForms = await management.find()
      let reconcileArr = [];

      manageForms.forEach(form => {
        let obj = {
          productName: String(),
          licenseType: String(),
          quantity: Number(),
          supported: String(),
          inventory: Number(),
          difference: Number(),
          amount: Number(),
        };
        obj.productName = form.license;
        obj.licenseType = form.licenseType;
        obj.quantity = form.quantity;
        obj.supported = "True"

        if (obj.licenseType === "Processor") {
          obj.inventory = procLogs;
          obj.difference = form.quantity - procLogs;
        } else {
          obj.inventory = nupLogs;
          obj.difference = form.quantity - nupLogs;
        }

        if (obj.difference >= 0) {
          obj.amount = 0;
        } else if (obj.difference < 0) {
          obj.amount = (obj.difference * form.unitPrice);
        }
        reconcileArr.push(obj);
      })

      return reconcileArr;

    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }


}