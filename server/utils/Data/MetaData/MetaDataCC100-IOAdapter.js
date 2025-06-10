/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema MetaData CC100IO Adapter
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
exports.MetaDataCC100IOAdapter = void 0;
var MetaDataAbstractAdapter_1 = require("./MetaDataAbstractAdapter");
var MetaDataType_1 = require("./MetaDataType");
var MetaDataCC100IOAdapter = /** @class */ (function (_super) {
    __extends(MetaDataCC100IOAdapter, _super);
    function MetaDataCC100IOAdapter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MetaDataType_1.MetaDataType.CC100IO_ADAPTER;
        return _this;
    }
    return MetaDataCC100IOAdapter;
}(MetaDataAbstractAdapter_1.MetaDataAbstractAdapter));
exports.MetaDataCC100IOAdapter = MetaDataCC100IOAdapter;
