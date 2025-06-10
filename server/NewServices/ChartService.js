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
exports.ChartService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var ChartService = /** @class */ (function (_super) {
    __extends(ChartService, _super);
    function ChartService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartService.prototype.delete = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.DeleteRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.ChartDeleteResponse ===
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
    ChartService.prototype.detail = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.DetailRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.ChartDetailResponse ===
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
    ChartService.prototype.save = function (item) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.SaveRequest(item);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartSaveResponse &&
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
    ChartService.prototype.list = function (offset, limit) {
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var request = new WDXSchema.WDX.Schema.Message.Chart.ListRequest({
            where: {},
            take: limit,
            skip: offset,
        });
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartListResponse &&
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
    ChartService.prototype.unregister = function (
    /**
     * Chart uuid
     */
    uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.UnsubscribeRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartUnsubscribeResponse &&
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
    ChartService.prototype.register = function (
    /**
     * Chart uuid
     */
    uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.SubscribeRequest(uuid);
        var response = new rxjs_1.Subject();
        var topic = "".concat(WDXSchema.WDX.Schema.Message.Type.ChartUpdate, "-").concat(uuid);
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartSubscribeResponse &&
                message.uuid === request.uuid) ||
                (topic === message.topic)) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    ChartService.prototype.configuration = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.ConfigurationRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartConfigurationResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    ChartService.prototype.data = function (
    /**
     * Chart uuid
     */
    uuid, dateFrom, dateTo) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.DataRequest(new WDXSchema.WDX.Schema.Model.Chart.DataRequestBody(uuid, dateFrom, dateTo));
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartDataResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    ChartService.prototype.export = function (uuid, type, dateFrom, dateTo) {
        var request = new WDXSchema.WDX.Schema.Message.Chart.ExportRequest(new WDXSchema.WDX.Schema.Model.Chart.ExportRequestBody(uuid, type, dateFrom, dateTo));
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartExportResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    return ChartService;
}(_1.AbstractAPIService));
exports.ChartService = ChartService;
