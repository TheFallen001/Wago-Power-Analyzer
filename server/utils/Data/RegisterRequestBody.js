/**
 * Elrest eDesign Runtime IPC Typescript Model Data Register Request Body
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRequestBody = void 0;
var RegisterRequestBody = /** @class */ (function () {
    function RegisterRequestBody(path, refreshMin, refreshMax, delta) {
        this.path = path;
        this.refreshMin = refreshMin;
        this.refreshMax = refreshMax;
        this.delta = delta;
    }
    return RegisterRequestBody;
}());
exports.RegisterRequestBody = RegisterRequestBody;
