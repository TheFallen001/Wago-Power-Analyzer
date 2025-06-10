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
exports.TrendService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var TrendService = /** @class */ (function (_super) {
    __extends(TrendService, _super);
    function TrendService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TrendService.prototype.delete = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Trend.DeleteRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.TrendingDeleteResponse ===
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
    TrendService.prototype.detail = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Trend.DetailRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.TrendingDetailResponse ===
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
    TrendService.prototype.save = function (trend) {
        var request = new WDXSchema.WDX.Schema.Message.Trend.SaveRequest(trend);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.TrendingSaveResponse &&
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
    TrendService.prototype.list = function (active, offset, limit) {
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var request = new WDXSchema.WDX.Schema.Message.Trend.ListRequest({
            where: {
                active: active,
            },
            take: limit,
            skip: offset,
        });
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.TrendingListResponse &&
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
    TrendService.prototype.unregister = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Trend.UnsubscribeRequest(uuid);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .TrendingUnsubscribeResponse &&
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
    TrendService.prototype.register = function (uuid) {
        var request = new WDXSchema.WDX.Schema.Message.Trend.SubscribeRequest(uuid);
        var response = new rxjs_1.Subject();
        var topic = "".concat(WDXSchema.WDX.Schema.Message.Type.TrendingUpdate, "-").concat(uuid);
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .TrendingSubscribeResponse &&
                message.uuid === request.uuid) ||
                (topic === message.topic &&
                    message.type ===
                        WDXSchema.WDX.Schema.Message.Type.TrendingUpdate)) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    TrendService.prototype.data = function (uuid, offset, limit, sortColumn, sortOrder, dateFrom, dateTo, dateFormat) {
        var _a;
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var params = {
            take: limit,
            skip: offset,
        };
        if (undefined !== sortOrder && undefined !== sortColumn) {
            params = Object.assign(params, {
                order: (_a = {},
                    _a[sortColumn] = sortOrder,
                    _a)
            });
        }
        var body = new WDXSchema.WDX.Schema.Model.Trend.DataRequestBody();
        body.conditions = params;
        body.dateFormat = dateFormat;
        body.dateFrom = dateFrom;
        body.dateTo = dateTo;
        body.trendUuid = uuid;
        var request = new WDXSchema.WDX.Schema.Message.Trend.DataRequest(body);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.TrendingDataResponse &&
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
    TrendService.prototype.export = function (uuid, type, dateFrom, dateTo, offset, limit, sortColumn, sortOrder, dateFormat, timezone) {
        var _a;
        if (offset === void 0) { offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET; }
        if (limit === void 0) { limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT; }
        var params = {
            take: limit,
            skip: offset,
        };
        if (undefined !== sortOrder && undefined !== sortColumn) {
            params = Object.assign(params, {
                order: (_a = {},
                    _a[sortColumn] = sortOrder,
                    _a)
            });
        }
        var body = new WDXSchema.WDX.Schema.Model.Trend.ExportRequestBody();
        body.conditions = params;
        body.dateFormat = dateFormat;
        body.timezone = timezone;
        body.dateFrom = dateFrom;
        body.dateTo = dateTo;
        body.trendUuid = uuid;
        body.type = type;
        var request = new WDXSchema.WDX.Schema.Message.Trend.ExportRequest(body);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .TrendingExportResponse &&
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
    return TrendService;
}(_1.AbstractAPIService));
exports.TrendService = TrendService;
