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
exports.APIServerInstance = void 0;
var Type_1 = require("./Type");
var Instance_1 = require("./Instance");
var APIServerExecutionOptions_1 = require("./APIServerExecutionOptions");
var APIServerInstance = /** @class */ (function (_super) {
    __extends(APIServerInstance, _super);
    function APIServerInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = Type_1.Type.APIServer;
        _this.namespace = Type_1.Type.Controller;
        _this.executionOptions = new APIServerExecutionOptions_1.APIServerExecutionOptions();
        return _this;
    }
    return APIServerInstance;
}(Instance_1.Instance));
exports.APIServerInstance = APIServerInstance;
