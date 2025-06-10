/**
 * Elrest eDesign Runtime IPC Typescript Model Data Get Schema Request Body
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSchemaRequestBody = void 0;
var GetSchemaRequestBody = /** @class */ (function () {
    function GetSchemaRequestBody(path, level) {
        if (level === void 0) { level = GetSchemaRequestBody.DEFAULT_LEVEL; }
        this.path = path;
        this.level = level;
    }
    GetSchemaRequestBody.DEFAULT_LEVEL = 1;
    return GetSchemaRequestBody;
}());
exports.GetSchemaRequestBody = GetSchemaRequestBody;
