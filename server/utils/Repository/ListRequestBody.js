/**
 * Elrest eDesign Runtime IPC Typescript Model Repository List Request Body
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRequestBody = void 0;
var Package_1 = require("../Package");
var ListRequestBody = /** @class */ (function () {
    function ListRequestBody(status) {
        if (status === void 0) { status = Package_1.Status.Any; }
        this.status = status;
    }
    return ListRequestBody;
}());
exports.ListRequestBody = ListRequestBody;
