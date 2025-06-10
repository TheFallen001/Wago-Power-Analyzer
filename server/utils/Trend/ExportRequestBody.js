/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportRequestBody = void 0;
var ExportRequestBody = /** @class */ (function () {
    function ExportRequestBody(trendId, type, dateFrom, dateTo) {
        this.trendId = trendId;
        this.type = type;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
    return ExportRequestBody;
}());
exports.ExportRequestBody = ExportRequestBody;
