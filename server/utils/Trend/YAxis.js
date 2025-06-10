/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAxis = void 0;
var uuid_1 = require("uuid");
var YAxisPostion_1 = require("./YAxisPostion");
var YAxis = /** @class */ (function () {
    function YAxis(uuid, id, name, label, min, max, position, format, color, visible) {
        if (uuid === void 0) { uuid = (0, uuid_1.v4)(); }
        if (position === void 0) { position = YAxisPostion_1.YAxisPostion.LEFT; }
        if (visible === void 0) { visible = true; }
        this.uuid = uuid;
        this.id = id;
        this.name = name;
        this.label = label;
        this.min = min;
        this.max = max;
        this.position = position;
        this.format = format;
        this.color = color;
        this.visible = visible;
    }
    return YAxis;
}());
exports.YAxis = YAxis;
