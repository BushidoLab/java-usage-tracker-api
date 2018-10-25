// const axios = require('axios');
import axios from 'axios';
import { errorHandler } from '../errors/errorHandler';

require('dotenv').config();

const channel = "default";
const NUPChaincode = "NUPChaincode";
const ProcChaincode = "ProcessorChaincode";
const chaincodeVer = "1.0";

      
// Function parses through JUT logs stored on blockchain and returns an array of objects
// Results array declared outside of function so it doesn't reset as the function recurses
function parseLogs(value, arr) {
  let results = arr;
  const str = value	
  const index = str.indexOf(",{");
  
  results.push(JSON.parse(str.substring(0, index)))
  const newStr = str.substring(index + 1)
  
  if (newStr.indexOf(",{") === -1) {
    results.push(JSON.parse(str.substring(index + 1)))
    return results
  }

  return parseLogs(newStr, arr);
}

export class LogService {
  // Query a company by name to return number of logs associated to it
  static async queryLogs() {
    const data = {
      channel,
      chaincode: NUPChaincode,
      chaincodeVer,
      method: "query",
      args: ["oracle"]
    };
    try {
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      return response.data.result.payload; 
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the  logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryProcLogs() {
    const data = {
      channel,
      chaincode: ProcChaincode,
      chaincodeVer,
      method: "query",
      args: ["oracle"]
    };
    try {
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      return response.data.result.payload; 
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the  logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryLog({args}) {
    const data = {
      channel,
      chaincode: NUPChaincode,
      chaincodeVer,
      method: "queryLog",
      args
    };

    try {
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      return response.data.result.payload; 
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the  logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryAllLogs() {
    const data = {
      channel,
      chaincode: NUPChaincode,
      chaincodeVer,
      method: "queryAllLogs",
      args: ["oracle"]
    };
    const logArr = [];

    try {
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      // Receives response and eliminates all instances of \"
      const logs = response.data.result.payload.replace(/\\"/gm, "");
      
      // const usageLogs = parseLogs(logs);

      return parseLogs(logs, logArr);
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryAllProcLogs() {
    const data = {
      channel,
      chaincode: ProcChaincode,
      chaincodeVer,
      method: "queryAllLogs",
      args: ["oracle"]
    };

    try {
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      let logs = JSON.parse(response.data.result.payload.replace(/\\"/gm, ""));
      logs["category"] = "Processor";
      logs["userCount"] = "1";
      logs["deviceName"] = "Server";
      logs["operatingSystem"] = "Linux";
      return logs;
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the  logs',
        data: error.response.error.data,
      })
    }
  }
}