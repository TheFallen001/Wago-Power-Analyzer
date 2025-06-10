/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAxis = void 0;
var DefaultFormat_1 = require("./DefaultFormat");
var XAxis = /** @class */ (function () {
    function XAxis(label, format, defaultFormat, visible) {
        if (label === void 0) { label = ''; }
        if (defaultFormat === void 0) { defaultFormat = DefaultFormat_1.DefaultFormat.HumanReadable; }
        if (visible === void 0) { visible = true; }
        this.label = label;
        this.format = format;
        this.defaultFormat = defaultFormat;
        this.visible = visible;
    }
    return XAxis;
}());
exports.XAxis = XAxis;
