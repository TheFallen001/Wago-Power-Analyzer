/**
 * Elrest eDesign Runtime IPC Typescript Model Trend Graph
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
var GraphOptions_1 = require("./GraphOptions");
var GraphType_1 = require("./GraphType");
var Graph = /** @class */ (function () {
    function Graph(type, options) {
        if (type === void 0) { type = GraphType_1.GraphType.line; }
        if (options === void 0) { options = new GraphOptions_1.GraphOptions(); }
        this.type = type;
        this.options = options;
    }
    return Graph;
}());
exports.Graph = Graph;
