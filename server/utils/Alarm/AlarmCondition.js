/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmCondition = void 0;
var AlarmCondition = /** @class */ (function () {
    function AlarmCondition(id, path, expression, value, createDateTime, updatedDateTime) {
        if (createDateTime === void 0) { createDateTime = Date.now(); }
        if (updatedDateTime === void 0) { updatedDateTime = createDateTime; }
        this.id = id;
        this.path = path;
        this.expression = expression;
        this.value = value;
        this.createDateTime = createDateTime;
        this.updatedDateTime = updatedDateTime;
    }
    return AlarmCondition;
}());
exports.AlarmCondition = AlarmCondition;
