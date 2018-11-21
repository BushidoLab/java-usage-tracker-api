// const axios = require('axios');
import axios from 'axios';
import { errorHandler } from '../errors/errorHandler';
import * as _ from 'lodash'
require('dotenv').config();

const channel = "default";
const NUPChaincode = "NUPChaincode";
const ProcChaincode = "Proc";
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
  static async queryAllNUPLogs() {
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
        log.version = log.version.trim();
        // Hardcoding missing data
        log.product = "Java SE Advanced Desktop";
        log.category = "NUP";
        log.userCount = 1;
        log.model = "N/A";
        log.cores = "N/A";
        log.vendor = "N/A";
        log.virtualMachine = "N/A";
        log.MAC = "N/A";
        log.subVendor = "N/A";
        log.serverName = "N/A";
        log.standbyServer = "N/A";
        log.optionsUsed = "N/A";
      });

      const uniqueLogs = _.uniqBy(usageLogs.reverse(), 'hostname');
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
      const response = await axios.post('https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query',
      procData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.OABCS_CREDS
        },
      })
      // Massaging received data
      let logs = response.data.result.payload.replace(/\\"/gm, "");
      let procLogs = parseLogs(logs, processorLogs);
      
      procLogs.forEach(log => {
        log.dateTime = new Date(log.dateTime).toDateString();
        if (log.OS === "Windows_NT") {
          log.OS = "Windows";
        } else if (log.OS === "Darwin") {
          log.OS = "macOS";
        }
        // Fitting log keys to fit with grid fields
        log.operatingSystem = log.OS;
        log.virtualMachine = log.virtualization;

        // Hardcoding missing data
        log.product = "Java SE Advanced";
        log.version = "1.8.0_181";
        log.appName = "Java Development Kit";
        log.userCount = 1;
        log.category = "Processor";
        log.serverName = "N/A";
        log.standbyServer = "N/A";
        log.optionsUsed = "N/A";
      })

      return procLogs;
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }

  static async queryAllLogs() {
    try {
      const usageLogs = await this.queryAllNUPLogs();
      let procLogs = await this.queryAllProcLogs();
      usageLogs.forEach(log => {
        procLogs.push(log)
      })
      procLogs.push(
        {
        product: "Oracle Database Enterprise Edition",
        deviceName: "DBASE1",
        IP: "10.1.1.15",
        MAC: "10:7B:44:18:02:78",
        subVendor: "Proliant",
        serverName: "SRVRDB01",
        version: "11g",
        virtualMachine: "LPAR",
        operatingSystem: "AIX 6",
        category: "Processor",
        standbyServer: "oracle_db_12345",
        model: "IBM P780 P7",
        cores: "6",
        appName: "Enterprise",
        userCount: "10",
        dateTime: "Fri Oct 26 2018",
        optionsUsed: "Advanced Security",
        vendor: "IBM"
      })
      return procLogs;
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }
}