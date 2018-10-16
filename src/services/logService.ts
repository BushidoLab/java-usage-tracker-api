// const axios = require('axios');
import axios from 'axios';
import { errorHandler } from '../errors/errorHandler';

require('dotenv').config();

export class LogService {
  // Query a company by name to return number of logs associated to it
  static async queryLogs({
    channel,
    chaincode,
    chaincodeVer,
    args
  }) {
    const data = {
      channel,
      chaincode,
      chaincodeVer,
      method: "query",
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

  static async queryLog({
    channel,
    chaincode,
    chaincodeVer,
    args
  }) {
    const data = {
      channel,
      chaincode,
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

  static async queryAllLogs({
    channel,
    chaincode,
    chaincodeVer,
    args
  }) {
    const data = {
      channel,
      chaincode,
      chaincodeVer,
      method: "queryAllLogs",
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
}