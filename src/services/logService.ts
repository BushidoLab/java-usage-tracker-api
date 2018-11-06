// const axios = require('axios');
import axios from 'axios';
import { errorHandler } from '../errors/errorHandler';
import * as _ from 'lodash'
require('dotenv').config();

const channel = "default";
const NUPChaincode = "NUPChaincode";
const ProcChaincode = "ProcessorChaincode";
const chaincodeVer = "1.0";

// Function parses through JUT logs stored on blockchain and returns an array of objects
function parseLogs(value, arr) {
  const results = arr;
  const index = value.indexOf(",{");
  const newStr = value.substring(index + 1)
  results.push(JSON.parse(value.substring(0, index)))
  
  if (newStr.indexOf(",{") === -1) {
    results.push(JSON.parse(value.substring(index + 1)))
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
      // Massaging received data
      // Receives response and eliminates all instances of \"
      const logs = response.data.result.payload.replace(/\\"/gm, "");
      const usageLogs = parseLogs(logs, logArr);

      usageLogs.forEach(log => {
        log.IP = log.hostname.substring(log.hostname.indexOf("/") + 1);
        log.hostname = log.hostname.substring(0, log.hostname.indexOf("/"));
        if (log.javaLocation.includes("jdk")) {
          log.appName = "Java Development Kit";
        } else if (log.javaLocation.includes("jre")) {
          log.appName = "Java Runtime Environment";
        }
        log.dateTime = new Date(log.dateTime).toDateString();
        log.operatingSystem = log.OS;
        delete log.OS;
        log.version = log.javaVersion;
        log.deviceName = log.hostname;
        log.logs = [];
        // Hardcoding fake data
        log.product = "Java";
        log.category = "NUP";
        log.userCount = 1;
        log.model = "N/A";
        log.cores = "N/A";
        log.vendor = "N/A"
        log.product = "Java SE Advanced Desktop"
      });

      const uniqueLogs = _.uniqBy(usageLogs, 'hostname');
      const uniqueArr = [];
      uniqueLogs.forEach(log => {
        uniqueArr.push(log);
      })

      uniqueArr.forEach(log => {
        for (let i = 0; i < usageLogs.length; i++) {
          if (_.isEqual(log, usageLogs[i])) {
            usageLogs.splice(i, 1);
          } else if (log.deviceName == usageLogs[i].deviceName) {
            log.logs.push(usageLogs[i]);
          }
        }
        if (log.logs.length === 0) {
          log.uses = 1;
        } else {
          log.uses = log.logs.length + 1;
        }
      }) 

      return uniqueArr;
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryAllProcLogs() {
    const procData = {
      channel,
      chaincode: ProcChaincode,
      chaincodeVer,
      method: "queryAllLogs",
      args: ["oracle"]
    };
    const processorLogs = [];

    try {
      const usageLogs = await this.queryAllLogs();
      try {
        const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
        procData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.OABCS_CREDS
          },
        })
        // Massaging received data
        const logs = response.data.result.payload.replace(/\\"/gm, "");
        let procLogs = parseLogs(logs, processorLogs);
        
        procLogs.forEach(log => {
          log.userCount = "1";
          log.category = "Processor";
          log.operatingSystem = "Linux";
          log.deviceName = `${log.operatingSystem} server`
          log.dateTime = new Date(log.dateTime).toDateString();
          log.IP = `192.168.1.30`;
          log.product = "Java SE Advanced";
          log.version = "1.8.0_181";
          log.appName = "Java Development Kit";
        })
        usageLogs.forEach(log => {
          procLogs.push(log);
        })
        return procLogs;
      } catch (error) {
        throw errorHandler('GetLogsError', {
          message: 'There was an error getting the logs',
          data: error.response.error.data,
        })
      }
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }
}