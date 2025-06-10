/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module
 * eWeb Application
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
exports.eWebDataAdapterInstance = void 0;
var Type_1 = require("../Type");
var Instance_1 = require("../Instance");
var eWebOptions_1 = require("./eWebOptions");
var eWebDataAdapterExecutionOptions_1 = require("./eWebDataAdapterExecutionOptions");
var DataSourceOptions_1 = require("../DataSourceOptions");
var eWebDataAdapterInstance = /** @class */ (function (_super) {
    __extends(eWebDataAdapterInstance, _super);
    function eWebDataAdapterInstance() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = Type_1.Type.eWebDataAdapter;
        _this.namespace = Type_1.Type.eWebDataAdapter;
        _this.eWebOptions = new eWebOptions_1.eWebOptions();
        _this.executionOptions = new eWebDataAdapterExecutionOptions_1.eWebDataAdapterExecutionOptions();
        _this.dataSourceOptions = new DataSourceOptions_1.DataSourceOptions('default');
        return _this;
    }
    return eWebDataAdapterInstance;
}(Instance_1.Instance));
exports.eWebDataAdapterInstance = eWebDataAdapterInstance;
