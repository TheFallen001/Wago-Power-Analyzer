/**
 * Elrest eDesign Runtime IPC Typescript Model Instance
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestartOptions = void 0;
var RestartOptions = /** @class */ (function () {
    function RestartOptions(autorestart, maxRestarts, restartCount) {
        this.autorestart = autorestart;
        this.maxRestarts = maxRestarts;
        this.restartCount = restartCount;
    }
    return RestartOptions;
}());
exports.RestartOptions = RestartOptions;
