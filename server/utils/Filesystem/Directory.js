/**
 * Elrest eDesign Runtime IPC Typescript Model Filesystem Directory
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
exports.Directory = void 0;
var Entry_1 = require("./Entry");
var EntryType_1 = require("./EntryType");
var Directory = /** @class */ (function (_super) {
    __extends(Directory, _super);
    function Directory(name, path, stats, children) {
        if (children === void 0) { children = new Array; }
        var _this = _super.call(this, name, path, stats, children) || this;
        _this.name = name;
        _this.path = path;
        _this.stats = stats;
        _this.children = children;
        _this.type = EntryType_1.EntryType.Directory;
        return _this;
    }
    return Directory;
}(Entry_1.Entry));
exports.Directory = Directory;
