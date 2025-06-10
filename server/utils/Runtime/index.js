/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.ClientProtocol = exports.ClientConfiguration = exports.Runtime = void 0;
var Runtime_1 = require("./Runtime");
Object.defineProperty(exports, "Runtime", { enumerable: true, get: function () { return Runtime_1.Runtime; } });
var ClientConfiguration_1 = require("./ClientConfiguration");
Object.defineProperty(exports, "ClientConfiguration", { enumerable: true, get: function () { return ClientConfiguration_1.ClientConfiguration; } });
var ClientProtocol_1 = require("./ClientProtocol");
Object.defineProperty(exports, "ClientProtocol", { enumerable: true, get: function () { return ClientProtocol_1.ClientProtocol; } });
var Report = require("./Report");
exports.Report = Report;
