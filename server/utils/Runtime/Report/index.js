/**
 * Elrest eDesign Runtime IPC Typescript Model Runtime
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.UvthreadResourceUsage = exports.ResourceUsage = exports.Report = exports.NetworkInterface = exports.NativeStack = exports.JavascriptStack = exports.JavascriptHeap = exports.Header = exports.CPU = void 0;
var CPU_1 = require("./CPU");
Object.defineProperty(exports, "CPU", { enumerable: true, get: function () { return CPU_1.CPU; } });
var Header_1 = require("./Header");
Object.defineProperty(exports, "Header", { enumerable: true, get: function () { return Header_1.Header; } });
var JavascriptHeap_1 = require("./JavascriptHeap");
Object.defineProperty(exports, "JavascriptHeap", { enumerable: true, get: function () { return JavascriptHeap_1.JavascriptHeap; } });
var JavascriptStack_1 = require("./JavascriptStack");
Object.defineProperty(exports, "JavascriptStack", { enumerable: true, get: function () { return JavascriptStack_1.JavascriptStack; } });
var NativeStack_1 = require("./NativeStack");
Object.defineProperty(exports, "NativeStack", { enumerable: true, get: function () { return NativeStack_1.NativeStack; } });
var NetworkInterface_1 = require("./NetworkInterface");
Object.defineProperty(exports, "NetworkInterface", { enumerable: true, get: function () { return NetworkInterface_1.NetworkInterface; } });
var Report_1 = require("./Report");
Object.defineProperty(exports, "Report", { enumerable: true, get: function () { return Report_1.Report; } });
var ResourceUsage_1 = require("./ResourceUsage");
Object.defineProperty(exports, "ResourceUsage", { enumerable: true, get: function () { return ResourceUsage_1.ResourceUsage; } });
var UvthreadResourceUsage_1 = require("./UvthreadResourceUsage");
Object.defineProperty(exports, "UvthreadResourceUsage", { enumerable: true, get: function () { return UvthreadResourceUsage_1.UvthreadResourceUsage; } });
