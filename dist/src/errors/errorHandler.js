"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_errors_1 = require("apollo-errors");
exports.errorHandler = function (name, _a) {
    var message = _a.message, data = _a.data;
    var Error = apollo_errors_1.createError(name, { message: message, data: data });
    throw new Error;
};
//# sourceMappingURL=errorHandler.js.map