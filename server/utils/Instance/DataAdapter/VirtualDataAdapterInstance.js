/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module
 * ORM Application
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
exports.VirtualDataAdapterInstance = void 0;
var Type_1 = require("../Type");
var Instance_1 = require("../Instance");
var VirtualDataAdapterExecutionOptions_1 = require("./VirtualDataAdapterExecutionOptions");
var DataSourceOptions_1 = require("../DataSourceOptions");
var VirtualDataAdapterInstance = /** @class */ (function (_super) {
    __extends(VirtualDataAdapterInstance, _super);
    function VirtualDataAdapterInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = Type_1.Type.VirtualDataAdapter;
        _this.namespace = Type_1.Type.VirtualDataAdapter;
        _this.executionOptions = new VirtualDataAdapterExecutionOptions_1.VirtualDataAdapterExecutionOptions();
        _this.dataSourceOptions = new DataSourceOptions_1.DataSourceOptions('default');
        return _this;
    }
    return VirtualDataAdapterInstance;
}(Instance_1.Instance));
exports.VirtualDataAdapterInstance = VirtualDataAdapterInstance;
