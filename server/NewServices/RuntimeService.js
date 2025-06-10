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
exports.RuntimeService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var RuntimeService = /** @class */ (function (_super) {
    __extends(RuntimeService, _super);
    function RuntimeService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RuntimeService.prototype.monitorSubscribe = function () {
        var request = new WDXSchema.WDX.Schema.Message.Runtime.MonitorSubscribeRequest();
        var response = new rxjs_1.Subject;
        this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .RuntimeMonitorSubscribeResponse &&
                request.uuid === message.uuid) {
                (message.error) ?
                    response.error(message.error) :
                    response.next(message.body);
            }
            else if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.RuntimeMonitor) {
                (message.error) ?
                    response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    RuntimeService.prototype.monitorUnsubscribe = function () {
        var request = new WDXSchema.WDX.Schema.Message.Runtime.MonitorUnsubscribeRequest();
        var response = new rxjs_1.Subject;
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .RuntimeMonitorUnsubscribeResponse &&
                message.uuid === request.uuid) {
                (message.error) ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    return RuntimeService;
}(_1.AbstractAPIService));
exports.RuntimeService = RuntimeService;
