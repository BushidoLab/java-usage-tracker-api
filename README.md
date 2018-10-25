### Chaincodes

There are three chaincodes that have been deployed for the use of this project.
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
