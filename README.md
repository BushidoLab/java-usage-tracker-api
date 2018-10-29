# Java Usage Tracker API

## Introduction
This project contains the API used to fetch information from our front end [VeraTrust app](https://github.com/BushidoLab/java-usage-tracker-app)

The main tecnology used is [GraphQL](https://graphql.org/) which is used to connect to both our [MongoDB](https://www.mongodb.com/) used to store form data and user info as well as our Oracle Autonomous Blockchain Cloud Service provided in the [Oracle cloud](https://cloud.oracle.com/home)

## What does it do?
It provides an API or an endpoint for us to make requests for querying and mutating data in our front end app

## How to use
- Run `npm install` to install all necessary dependencies
- Run `npm start` to start server
  - Server is run by default on localhost:4000, and an intance of [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/v2/features/graphql-playground.html) is served to test mutations and queries defined in this project
- MongoDB models are all defined in `/src/db/models/` folder where a schema for each of the collections is defined
- All requests and operations performed on the data are found in the `/src/services/` folder
- These services contain queries and mutations needed for the app, which are exported from their respective service files and instantiated in `/src/resolvers/` folder
- Then all of these queries and mutations are defined in the `/src/types/schema.graphql` file were the queries and mutations parameters and return values are defined

## Chaincodes
There are three chaincodes that have been deployed for the use of this project.
As of now each of these three chaincodes are hardcoded into the requests mostly encapsulated in the `/src/services/logService.ts` in axios requests.
- There are three query methods to be invoked in all chaincodes
  1. query
    - Takes in company name as arg
    - Returns total log count of that company
  2. queryLog
    - Takes in a logs key as arg
    - Returns log associated with that key
  3. queryAllLogs
    - Takes in company name as arg
    - Returns all logs stored associated with that company name

The three chaincodes differ in how each log is stored. 

1. Named User Plus tracker or NUPChaincode
  - Chaincode name is NUPChaincode
  - Configured in REST proxy 1 and channel "default"
  - Was initialized with "oracle" as company name
  - Logs are stored as JSON stringified object with values of process, dateTime, hostname, javaLocation, javaVersion, OS, OSArchitecture and OSVersion

2. Processor based license or ProcessorChaincode
  - Chaincode name is ProcessorChaincode
  - Configured in REST proxy 1 and channel "default"
  - Was initialized with "oracle" as company name
  - Logs stored as JSON stringified object with values of cpu, vendor, model and dateTime

3. Global chaincode or GlobalTracker
  - Chaincode name is GlobalTracker
  - Configured in REST proxy 1 and channel "default"
  - Was initialized with "oracle" as company name
  - Logs stored as a JSON stringified object with keys as numbers starting at 1 and increasing by one per each argument passed
  - This chaincode can support any format of logs to be stored
