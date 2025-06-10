/**
 * Elrest eDesign Runtime IPC Typescript Model Script
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
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
exports.Script = void 0;
var Filesystem_1 = require("./../Filesystem");
var Script = /** @class */ (function (_super) {
    __extends(Script, _super);
    function Script(path, name, stats, content, instance) {
        var _this = _super.call(this, name, path, stats, content) || this;
        _this.path = path;
        _this.name = name;
        _this.stats = stats;
        _this.content = content;
        _this.instance = instance;
        return _this;
    }
    return Script;
}(Filesystem_1.File));
exports.Script = Script;
