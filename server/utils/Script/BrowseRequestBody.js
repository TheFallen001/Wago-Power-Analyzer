/**
 * Elrest eDesign Runtime IPC Typescript Model Script Browse Request Body
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowseRequestBody = void 0;
var _1 = require(".");
var BrowseRequestBody = /** @class */ (function () {
    function BrowseRequestBody(
    /**
     * eDesign Runtime JS Runtime Storage Path
     */
    path, 
    /**
     * eDesign Runtime JS Runtime Storage Browse Level
     *
     * @default DEFAULT_LEVEL
     */
    level) {
        if (level === void 0) { level = _1.BROWSE_DEFAULT_LEVEL; }
        this.path = path;
        this.level = level;
    }
    return BrowseRequestBody;
}());
exports.BrowseRequestBody = BrowseRequestBody;
