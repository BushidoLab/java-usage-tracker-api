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

      usageLogs.push(
        {
          hostname: "VIVO PC/192.168.1.22",
          subVendor: "Red Hat, Inc.",
          javaVersion: "1.8.0_181",
          virtualMachine: "VT-x",
          OS: "Linux",
          category: "NUP",
          javaLocation: "jdk",
          userCount: "1",
          dateTime: "Mon Dec 03 2018",
        }
      )

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
        log.version = log.javaVersion.trim();
        log.deviceName = log.hostname;
        log.logs = [];

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
        // Changing my logs to another deviceName
        if (log.deviceName.includes("diego-hp-spectre")) {
          log.deviceName = "ubuntu-virtual-1";
        }

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

      // Adding fake DB entries to populate audit grid
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
        },
        {
          product: "Oracle Database Enterprise Edition",
          deviceName: "DBASE2",
          IP: "10.1.1.15",
          MAC: "10:99:00:27:5D:A9",
          subVendor: "Proliant",
          serverName: "SRVRDB02",
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
        },
        {
          product: "Oracle Database Enterprise Edition",
          deviceName: "DBASE3",
          IP: "10.1.1.15",
          MAC: "10:1F:3E:B4:99:58",
          subVendor: "Proliant",
          serverName: "SRVRDB03",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_12345",
          model: "IBM P780 P7",
          cores: "6",
          appName: "Enterprise",
          userCount: "10",
          dateTime: "Sat Oct 27 2018",
          optionsUsed: "Advanced Security",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Enterprise Edition",
          deviceName: "DBASE4",
          IP: "10.1.1.15",
          MAC: "10:B8:29:2C:A0:B3",
          subVendor: "Proliant",
          serverName: "SRVRDB04",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_12345",
          model: "IBM P780 P7",
          cores: "6",
          appName: "Enterprise",
          userCount: "15",
          dateTime: "Sat Oct 27 2018",
          optionsUsed: "Database In-Memory",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Enterprise Edition",
          deviceName: "DBASE5",
          IP: "10.1.1.15",
          MAC: "10:0B:C4:A5:96:F6",
          subVendor: "Proliant",
          serverName: "SRVRDB05",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_12345",
          model: "IBM P780 P7",
          cores: "6",
          appName: "Enterprise",
          userCount: "1",
          dateTime: "Sat Oct 27 2018",
          optionsUsed: "Partitioning",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Mobile Server",
          deviceName: "MOBDBASE1",
          IP: "10.1.1.15",
          MAC: "10:44:D0:15:2F:3F",
          subVendor: "Proliant",
          serverName: "SRVRDB06",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_14442",
          model: "IBM P780 P7",
          cores: "6",
          appName: "Enterprise",
          userCount: "100",
          dateTime: "Sun Oct 28 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "NoSQL Database Enterprise Edition",
          deviceName: "NOSQLDBASE1",
          IP: "10.0.1.16",
          MAC: "10:12:4E:45:CF:E3",
          subVendor: "Proliant",
          serverName: "NOSQLSRVRDB01",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "16",
          appName: "NoSQL Database",
          userCount: "10",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "NoSQL Database Enterprise Edition",
          deviceName: "NOSQLDBASE2",
          IP: "10.0.1.16",
          MAC: "10:1D:2F:3D:B7:8A",
          subVendor: "Proliant",
          serverName: "NOSQLSRVRDB02",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "16",
          appName: "NoSQL Database",
          userCount: "10",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "NoSQL Database Enterprise Edition",
          deviceName: "NOSQLDBASE3",
          IP: "10.0.1.16",
          MAC: "10:CA:B1:07:74:33",
          subVendor: "Proliant",
          serverName: "NOSQLSRVRDB03",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "16",
          appName: "NoSQL Database",
          userCount: "10",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "NoSQL Database Enterprise Edition",
          deviceName: "NOSQLDBASE4",
          IP: "10.0.1.16",
          MAC: "10:C0:89:5F:9E:43",
          subVendor: "Proliant",
          serverName: "NOSQLSRVRDB04",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "16",
          appName: "NoSQL Database",
          userCount: "10",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "NoSQL Database Enterprise Edition",
          deviceName: "NOSQLDBASE5",
          IP: "10.0.1.16",
          MAC: "10:04:3E:11:DE:D7",
          subVendor: "Proliant",
          serverName: "NOSQLSRVRDB05",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "16",
          appName: "NoSQL Database",
          userCount: "10",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Standard Edition 2",
          deviceName: "DBASE2-1",
          IP: "10.0.1.16",
          MAC: "10:D6:0A:BD:D8:D0",
          subVendor: "Proliant",
          serverName: "STD2BASESRV1",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "8",
          appName: "Standard Edition 2",
          userCount: "10",
          dateTime: "Sat Dec 1 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Standard Edition 2",
          deviceName: "DBASE2-2",
          IP: "10.0.1.16",
          MAC: "10:E2:C8:AF:F6:53",
          subVendor: "Proliant",
          serverName: "STD2BASESRV2",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "8",
          appName: "Standard Edition 2",
          userCount: "10",
          dateTime: "Sat Dec 1 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Standard Edition 2",
          deviceName: "DBASE2-3",
          IP: "10.0.1.16",
          MAC: "10:18:0D:C5:77:9E",
          subVendor: "Proliant",
          serverName: "STD2BASESRV3",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "Processor",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "8",
          appName: "Standard Edition 2",
          userCount: "5",
          dateTime: "Sat Dec 1 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
        {
          product: "Oracle Database Personal Edition",
          deviceName: "MyDB",
          IP: "192.168.1.30",
          MAC: "5B:DA:E7:28:E5:7D",
          subVendor: "Proliant",
          serverName: "PERSONALDB1",
          version: "11g",
          virtualMachine: "LPAR",
          operatingSystem: "AIX 6",
          category: "NUP",
          standbyServer: "oracle_db_29901",
          model: "IBM P770 P7",
          cores: "4",
          appName: "Personal Edition",
          userCount: "1",
          dateTime: "Mon Dec 3 2018",
          optionsUsed: "N/A",
          vendor: "IBM"
        },
      )
      return procLogs;
    } catch (error) {
      throw errorHandler('GetLogsError', {
        message: 'There was an error getting the logs',
        data: error.response.error.data,
      })
    }
  }
}