/**
 * Elrest eDesign Runtime IPC Typescript Model Instance
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
var Log = /** @class */ (function () {
    function Log(level, date, channel, title, messsage, instanceUuid) {
        if (instanceUuid === void 0) { instanceUuid = ''; }
        this.level = level;
        this.date = date;
        this.channel = channel;
        this.title = title;
        this.messsage = messsage;
        this.instanceUuid = instanceUuid;
    }
    return Log;
}());
exports.Log = Log;
