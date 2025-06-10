/**
 * Elrest eDesign Runtime IPC Typescript Model Package ListRequestBody
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRequestBody = void 0;
var Status_1 = require("./Status");
var ListRequestBody = /** @class */ (function () {
    function ListRequestBody(status) {
        if (status === void 0) { status = Status_1.Status.Available; }
        this.status = status;
    }
    return ListRequestBody;
}());
exports.ListRequestBody = ListRequestBody;
