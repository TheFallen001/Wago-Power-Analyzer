/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema MetaData OPCUA
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
exports.MetaDataOPCUA = void 0;
var AbstractMetaData_1 = require("./AbstractMetaData");
var MetaDataType_1 = require("./MetaDataType");
var MetaDataOPCUA = /** @class */ (function (_super) {
    __extends(MetaDataOPCUA, _super);
    function MetaDataOPCUA(nodeId, nodeClass, dataType, accessLevel, arrayDimention) {
        var _this = _super.call(this) || this;
        _this.nodeId = nodeId;
        _this.nodeClass = nodeClass;
        _this.dataType = dataType;
        _this.accessLevel = accessLevel;
        _this.arrayDimention = arrayDimention;
        _this.type = MetaDataType_1.MetaDataType.OPCUA;
        return _this;
    }
    return MetaDataOPCUA;
}(AbstractMetaData_1.AbstractMetaData));
exports.MetaDataOPCUA = MetaDataOPCUA;
