/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var AlarmService = /** @class */ (function (_super) {
    __extends(AlarmService, _super);
    function AlarmService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AlarmService.prototype.delete = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.DeleteRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingDeleteResponse ===
                message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.confirmAll = function () {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest();
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingConfirmResponse ===
                message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.confirm = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingConfirmResponse ===
                message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.detail = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.DetailRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingDetailResponse ===
                message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.save = function (alarm) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.SetRequest(alarm);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.AlarmingSetResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.list = function (active, offset, limit) {
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var request = new WDXSchema.WDX.Schema.Message.Alarm.ListRequest({
            where: {
                active: active,
            },
            take: limit,
            skip: offset,
        });
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.AlarmingListResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.listAlarmHistory = function (
    /**
     * Alarm Code
     */
    alarmCode, offset, limit) {
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var request = new WDXSchema.WDX.Schema.Message.Alarm.ListHistoryRequest({
            where: {
                number: alarmCode,
            },
            take: limit,
            skip: offset,
        });
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingListHistoryResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.unregister = function () {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.UnsubscribeRequest();
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingUnsubscribeResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(undefined);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.register = function () {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.SubscribeRequest();
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingSubscribeResponse &&
                message.uuid === request.uuid) ||
                message.type ===
                    WDXSchema.WDX.Schema.Message.Type.AlarmingUpdate) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.getStatus = function (
    /**
     * Alarm code number
     */
    code) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.GetStatusRequest(code);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingGetStatusResponse === message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.setActive = function (
    /**
     * Alarm code number
     */
    code) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.SetActiveRequest(code);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingSetActiveResponse === message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    AlarmService.prototype.setInactive = function (
    /**
     * Alarm code number
     */
    code) {
        var request = new WDXSchema.WDX.Schema.Message.Alarm.SetInactiveRequest(code);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingSetInactiveResponse === message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    return AlarmService;
}(_1.AbstractAPIService));
exports.AlarmService = AlarmService;
