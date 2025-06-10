/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema MetaData MQTT
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
exports.MetaDataMQTT = void 0;
var MetaDataStore_1 = require("./MetaDataStore");
var MetaDataType_1 = require("./MetaDataType");
var MetaDataMQTT = /** @class */ (function (_super) {
    __extends(MetaDataMQTT, _super);
    function MetaDataMQTT() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MetaDataType_1.MetaDataType.MQTT;
        return _this;
    }
    return MetaDataMQTT;
}(MetaDataStore_1.MetaDataStore));
exports.MetaDataMQTT = MetaDataMQTT;
