/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema Metadata eWeb
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
exports.MetaDataEWebProvider = void 0;
var MetaDataAbstractProvider_1 = require("./MetaDataAbstractProvider");
var MetaDataType_1 = require("./MetaDataType");
var MetaDataEWebProvider = /** @class */ (function (_super) {
    __extends(MetaDataEWebProvider, _super);
    function MetaDataEWebProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MetaDataType_1.MetaDataType.EWEB_PROVIDER;
        _this.providedType = MetaDataType_1.MetaDataType.EWEB_ADAPTER;
        _this.providerBasePath = 'eweb';
        return _this;
    }
    return MetaDataEWebProvider;
}(MetaDataAbstractProvider_1.MetaDataAbstractProvider));
exports.MetaDataEWebProvider = MetaDataEWebProvider;
