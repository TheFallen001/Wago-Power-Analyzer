/**
 * Elrest eDesign Runtime IPC Typescript Model Data
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnregisterResponseBody = exports.UnregisterRequestBody = exports.RegisterRequestBody = exports.GetSchemaRequestBody = exports.GetRequestBody = exports.DataValue = exports.DataType = exports.MetaData = exports.DataSchema = exports.PATH_SEPARATOR = void 0;
exports.PATH_SEPARATOR = '.';
var DataSchema_1 = require("./DataSchema");
Object.defineProperty(exports, "DataSchema", { enumerable: true, get: function () { return DataSchema_1.DataSchema; } });
var MetaData = require("./MetaData");
exports.MetaData = MetaData;
var DataType_1 = require("./DataType");
Object.defineProperty(exports, "DataType", { enumerable: true, get: function () { return DataType_1.DataType; } });
var DataValue_1 = require("./DataValue");
Object.defineProperty(exports, "DataValue", { enumerable: true, get: function () { return DataValue_1.DataValue; } });
var GetRequestBody_1 = require("./GetRequestBody");
Object.defineProperty(exports, "GetRequestBody", { enumerable: true, get: function () { return GetRequestBody_1.GetRequestBody; } });
var GetSchemaRequestBody_1 = require("./GetSchemaRequestBody");
Object.defineProperty(exports, "GetSchemaRequestBody", { enumerable: true, get: function () { return GetSchemaRequestBody_1.GetSchemaRequestBody; } });
var RegisterRequestBody_1 = require("./RegisterRequestBody");
Object.defineProperty(exports, "RegisterRequestBody", { enumerable: true, get: function () { return RegisterRequestBody_1.RegisterRequestBody; } });
var UnregisterRequestBody_1 = require("./UnregisterRequestBody");
Object.defineProperty(exports, "UnregisterRequestBody", { enumerable: true, get: function () { return UnregisterRequestBody_1.UnregisterRequestBody; } });
var UnregisterResponseBody_1 = require("./UnregisterResponseBody");
Object.defineProperty(exports, "UnregisterResponseBody", { enumerable: true, get: function () { return UnregisterResponseBody_1.UnregisterResponseBody; } });
