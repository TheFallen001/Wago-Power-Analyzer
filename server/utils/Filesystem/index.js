/**
 * Elrest eDesign Runtime IPC Typescript Model Filesystem
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.EntryType = exports.Entry = exports.Directory = exports.DIRECTORY_SEPARATOR = void 0;
var Directory_1 = require("./Directory");
Object.defineProperty(exports, "Directory", { enumerable: true, get: function () { return Directory_1.Directory; } });
var Entry_1 = require("./Entry");
Object.defineProperty(exports, "Entry", { enumerable: true, get: function () { return Entry_1.Entry; } });
var EntryType_1 = require("./EntryType");
Object.defineProperty(exports, "EntryType", { enumerable: true, get: function () { return EntryType_1.EntryType; } });
var File_1 = require("./File");
Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_1.File; } });
exports.DIRECTORY_SEPARATOR = '\\';
