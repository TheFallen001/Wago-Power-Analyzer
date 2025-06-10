/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphData = void 0;
var GraphData = /** @class */ (function () {
    function GraphData(trendId, labels, datasets) {
        this.trendId = trendId;
        this.labels = labels;
        this.datasets = datasets;
    }
    return GraphData;
}());
exports.GraphData = GraphData;
