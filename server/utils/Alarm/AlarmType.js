/**
 * Elrest eDesign Runtime Adapter Store Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmType = void 0;
var AlarmType;
(function (AlarmType) {
    AlarmType["INFO_WITH_ACK"] = "info-ack";
    AlarmType["INFO_WITHOUT_ACK"] = "info-no-ack";
    AlarmType["INFO_GONE_WITH_ACK"] = "info-gone-with-ack";
    AlarmType["WARNING_WITH_ACK"] = "warning-ack";
    AlarmType["WARNING_WITHOUT_ACK"] = "warning-no-ack";
    AlarmType["WARNING_GONE_WITH_ACK"] = "warning-gone-with-ack";
    AlarmType["ERROR_WITH_ACK"] = "error-ack";
    AlarmType["ERROR_WITHOUT_ACK"] = "error-no-ack";
    AlarmType["ERROR_GONE_WITH_ACK"] = "error-gone-with-ack";
})(AlarmType || (exports.AlarmType = AlarmType = {}));
