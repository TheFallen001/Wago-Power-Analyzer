/**
 * Elrest eDesign Runtime IPC Typescript Model Trend
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportRequestBody = exports.DefaultFormat = exports.YAxisPostion = exports.DataSet = exports.YAxis = exports.XAxis = exports.Trend = exports.Export = exports.Graph = void 0;
var Trend_1 = require("./Trend");
Object.defineProperty(exports, "Trend", { enumerable: true, get: function () { return Trend_1.Trend; } });
var XAxis_1 = require("./XAxis");
Object.defineProperty(exports, "XAxis", { enumerable: true, get: function () { return XAxis_1.XAxis; } });
var YAxis_1 = require("./YAxis");
Object.defineProperty(exports, "YAxis", { enumerable: true, get: function () { return YAxis_1.YAxis; } });
var DataSet_1 = require("./DataSet");
Object.defineProperty(exports, "DataSet", { enumerable: true, get: function () { return DataSet_1.DataSet; } });
var YAxisPostion_1 = require("./YAxisPostion");
Object.defineProperty(exports, "YAxisPostion", { enumerable: true, get: function () { return YAxisPostion_1.YAxisPostion; } });
var DefaultFormat_1 = require("./DefaultFormat");
Object.defineProperty(exports, "DefaultFormat", { enumerable: true, get: function () { return DefaultFormat_1.DefaultFormat; } });
var Graph = require("./Graph");
exports.Graph = Graph;
var Export = require("./Export");
exports.Export = Export;
var ExportRequestBody_1 = require("./ExportRequestBody");
Object.defineProperty(exports, "ExportRequestBody", { enumerable: true, get: function () { return ExportRequestBody_1.ExportRequestBody; } });
