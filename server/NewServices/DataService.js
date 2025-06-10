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
exports.DataService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var DataService = /** @class */ (function (_super) {
    __extends(DataService, _super);
    function DataService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataService.prototype.deleteSchema = function (path) {
        var request = new WDXSchema.WDX.Schema.Message.Data.DeleteSchemaRequest(path);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type.DataDeleteSchemaResponse ===
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
    DataService.prototype.refreshSchema = function (path) {
        var request = new WDXSchema.WDX.Schema.Message.Data.RefreshSchemaRequest(path);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (WDXSchema.WDX.Schema.Message.Type
                .DataRefreshSchemaResponse === message.type &&
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
    DataService.prototype.setSchema = function (schema) {
        var request = new WDXSchema.WDX.Schema.Message.Data.SetSchemaRequest(schema);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSetSchemaResponse &&
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
    DataService.prototype.getSchema = function (path, level) {
        if (level === void 0) { level = WDXSchema.WDX.Schema.Model.Data.GetSchemaRequestBody.DEFAULT_LEVEL; }
        var request = new WDXSchema.WDX.Schema.Message.Data.GetSchemaRequest(path, level);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataGetSchemaResponse &&
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
    DataService.prototype.unregister = function (path) {
        var request = new WDXSchema.WDX.Schema.Message.Data.UnregisterValueRequest(path);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataUnregisterValueResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(path);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    DataService.prototype.register = function (path) {
        var request = new WDXSchema.WDX.Schema.Message.Data.RegisterValueRequest(path);
        var response = new rxjs_1.Subject();
        var topic = "".concat(WDXSchema.WDX.Schema.Message.Type.DataUpdate, "-").concat(path);
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataRegisterValueResponse &&
                message.uuid === request.uuid) ||
                message.type ===
                    WDXSchema.WDX.Schema.Message.Type.DataUpdate &&
                    message.topic === topic) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    DataService.prototype.registerDataSchemaChanges = function () {
        var request = new WDXSchema.WDX.Schema.Message.Data.RegisterSchemaChangesRequest();
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSchemaChanges) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    DataService.prototype.unregisterDataSchemaChanges = function () {
        var request = new WDXSchema.WDX.Schema.Message.Data.UnregisterSchemaChangesRequest();
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataUnregisterSchemaChangesResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(null);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    DataService.prototype.getValue = function (path) {
        var request = new WDXSchema.WDX.Schema.Message.Data.GetValueRequest(path);
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataGetValueResponse &&
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
    DataService.prototype.setValue = function (path, value) {
        var request = new WDXSchema.WDX.Schema.Message.Data.SetValueRequest(new WDXSchema.WDX.Schema.Model.Data.DataValue(path, value));
        var response = new rxjs_1.Subject();
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSetValueResponse &&
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
    return DataService;
}(_1.AbstractAPIService));
exports.DataService = DataService;
