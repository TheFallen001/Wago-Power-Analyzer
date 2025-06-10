/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module Web
 * Socket Server Application Controller
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
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
exports.AuthServerInstance = void 0;
var Type_1 = require("./Type");
var Instance_1 = require("./Instance");
var AuthServerExecutionOptions_1 = require("./AuthServerExecutionOptions");
var AuthServerInstance = /** @class */ (function (_super) {
    __extends(AuthServerInstance, _super);
    function AuthServerInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = Type_1.Type.AuthServer;
        _this.namespace = Type_1.Type.Controller;
        _this.executionOptions = new AuthServerExecutionOptions_1.AuthServerExecutionOptions();
        return _this;
    }
    return AuthServerInstance;
}(Instance_1.Instance));
exports.AuthServerInstance = AuthServerInstance;
