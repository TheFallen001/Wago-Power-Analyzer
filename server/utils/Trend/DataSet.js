/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSet = void 0;
var uuid_1 = require("uuid");
var DataSet = /** @class */ (function () {
    function DataSet(uuid, id, name, label, dataSchemaPath, color, 
    /**
     * Y-Axis uuid
     */
    yAxis, enabled, visible, valueSnapshot) {
        if (uuid === void 0) { uuid = (0, uuid_1.v4)(); }
        if (enabled === void 0) { enabled = false; }
        if (visible === void 0) { visible = false; }
        this.uuid = uuid;
        this.id = id;
        this.name = name;
        this.label = label;
        this.dataSchemaPath = dataSchemaPath;
        this.color = color;
        this.yAxis = yAxis;
        this.enabled = enabled;
        this.visible = visible;
        this.valueSnapshot = valueSnapshot;
    }
    return DataSet;
}());
exports.DataSet = DataSet;
