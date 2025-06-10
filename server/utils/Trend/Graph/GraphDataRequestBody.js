/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphDataRequestBody = void 0;
var GraphDataRequestBody = /** @class */ (function () {
    function GraphDataRequestBody(trendId, dateFrom, dateTo) {
        this.trendId = trendId;
        this.dateFrom = dateFrom;
        this.dateTo = dateTo;
    }
    return GraphDataRequestBody;
}());
exports.GraphDataRequestBody = GraphDataRequestBody;
