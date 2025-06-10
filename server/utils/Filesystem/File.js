/**
 * Elrest eDesign Runtime IPC Typescript Model Filesystem File
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
var Entry_1 = require("./Entry");
var EntryType_1 = require("./EntryType");
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File(name, path, stats, content, mime) {
        var _this = _super.call(this, name, path, stats, [], content) || this;
        _this.name = name;
        _this.path = path;
        _this.stats = stats;
        _this.content = content;
        _this.mime = mime;
        _this.type = EntryType_1.EntryType.File;
        return _this;
    }
    return File;
}(Entry_1.Entry));
exports.File = File;
