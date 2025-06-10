/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphOptions = void 0;
var GraphOptions = /** @class */ (function () {
    function GraphOptions(responsive, scales) {
        if (responsive === void 0) { responsive = true; }
        if (scales === void 0) { scales = {}; }
        this.responsive = responsive;
        this.scales = scales;
    }
    return GraphOptions;
}());
exports.GraphOptions = GraphOptions;
