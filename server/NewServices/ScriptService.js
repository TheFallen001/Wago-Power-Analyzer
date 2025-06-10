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
exports.ScriptService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var ScriptService = /** @class */ (function (_super) {
    __extends(ScriptService, _super);
    function ScriptService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScriptService.prototype.list = function (path, level) {
        if (level === void 0) { level = WDXSchema.WDX.Schema.Model.Script.BROWSE_DEFAULT_LEVEL; }
        var request = new WDXSchema.WDX.Schema.Message.Script.BrowseRequest(path, level);
        var response = new rxjs_1.Subject;
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ScriptBrowseResponse &&
                message.uuid === request.uuid) {
                (message.error) ?
                    response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    ScriptService.prototype.save = function (entry) {
        var request = new WDXSchema.WDX.Schema.Message.Script.SaveRequest(entry);
        var response = new rxjs_1.Subject;
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ScriptSaveResponse &&
                message.uuid === request.uuid) {
                (message.error) ?
                    response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    ScriptService.prototype.delete = function (entry) {
        var request = new WDXSchema.WDX.Schema.Message.Script.DeleteRequest(entry);
        var response = new rxjs_1.Subject;
        var subscription = this._clientService.incommingMessages.subscribe(function (message) {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ScriptDeleteResponse &&
                message.uuid === request.uuid) {
                (message.error) ?
                    response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    };
    return ScriptService;
}(_1.AbstractAPIService));
exports.ScriptService = ScriptService;
