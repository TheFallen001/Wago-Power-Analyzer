/**
 * Elrest eDesign Runtime IPC Typescript Model Instance
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
var uuid_1 = require("uuid");
var Status_1 = require("./Status");
var LogOptions_1 = require("./LogOptions");
var DataSourceOptions_1 = require("./DataSourceOptions");
var LogLevel_1 = require("./LogLevel");
var Instance = /** @class */ (function () {
    function Instance(uuid, name, status, executionOptions, restartOptions, cronOptions, logOptions, enabled, processId, parentProcessId, threadId) {
        if (uuid === void 0) { uuid = (0, uuid_1.v4)(); }
        if (status === void 0) { status = Status_1.Status.Offline; }
        this.name = name;
        this.status = status;
        this.executionOptions = executionOptions;
        this.restartOptions = restartOptions;
        this.cronOptions = cronOptions;
        this.enabled = enabled;
        this.processId = processId;
        this.parentProcessId = parentProcessId;
        this.threadId = threadId;
        this.dataSourceOptions = new DataSourceOptions_1.DataSourceOptions();
        this.createdDate = Date.now();
        this.updatedDate = this.createdDate;
        this.uuid = uuid;
        if (logOptions) {
            this.logOptions = logOptions;
        }
        else {
            this.logOptions = new LogOptions_1.LogOptions(LogLevel_1.LogLevel.debug, undefined, undefined, undefined, true, './logs/' + uuid + '.log');
        }
    }
    return Instance;
}());
exports.Instance = Instance;
