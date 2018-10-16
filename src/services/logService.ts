const axios = require('axios');
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
      channel: {
        channel
      },
      chaincode: {
        chaincode
      },
      chaincodeVer: {
        chaincodeVer
      },
      method: "query",
      args: {
        ...args
      }
    };

    const JSONdata = JSON.stringify(data);

    axios
      .post(
        "https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query",
        JSONdata, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.OABCS_CREDS
          },
          proxy: {
            host: "8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com",
            port: 443,
            path: "/restproxy1/bcsgw/rest/v1/transaction/query"
          },
          data: data
        }
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }

  // Query a single log by its ID
  static async queryLog({
    channel,
    chaincode,
    chaincodeVer,
    args
  }) {
    const data = {
      channel: {
        channel
      },
      chaincode: {
        chaincode
      },
      chaincodeVer: {
        chaincodeVer
      },
      method: "queryLog",
      args: {
        ...args
      }
    }
    const JSONdata = JSON.stringify(data);

    axios
      .post(
        "https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query",
        JSONdata, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.OABCS_CREDS
          },
          proxy: {
            host: "8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com",
            port: 443,
            path: "/restproxy1/bcsgw/rest/v1/transaction/query"
          },
          data: data
        }
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }

  // Query a all logs associated to a company
  static async queryAllLogs({
    channel,
    chaincode,
    chaincodeVer,
    args
  }) {
    const data = {
      channel: {
        channel
      },
      chaincode: {
        chaincode
      },
      chaincodeVer: {
        chaincodeVer
      },
      method: "queryAllLogs",
      args: {
        ...args
      }
    }
    const JSONdata = JSON.stringify(data);

    axios
      .post(
        "https://8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com:443/restproxy1/bcsgw/rest/v1/transaction/query",
        JSONdata, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.OABCS_CREDS
          },
          proxy: {
            host: "8BECD2B5F48C47EEB7375AB654A8D7A5.blockchain.ocp.oraclecloud.com",
            port: 443,
            path: "/restproxy1/bcsgw/rest/v1/transaction/query"
          },
          data: data
        }
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error;
      });
  }
}