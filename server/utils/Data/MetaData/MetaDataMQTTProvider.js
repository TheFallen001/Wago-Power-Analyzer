/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema MetaData MQTT Adapter
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
exports.MetaDataMQTTProvider = void 0;
var AbstractMetaData_1 = require("./AbstractMetaData");
var MetaDataType_1 = require("./MetaDataType");
var MetaDataMQTTProvider = /** @class */ (function (_super) {
    __extends(MetaDataMQTTProvider, _super);
    function MetaDataMQTTProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = MetaDataType_1.MetaDataType.MQTT_PROVIDER;
        _this.providedType = MetaDataType_1.MetaDataType.MQTT_ADAPTER;
        _this.providerBasePath = 'mqtt';
        return _this;
    }
    return MetaDataMQTTProvider;
}(AbstractMetaData_1.AbstractMetaData));
exports.MetaDataMQTTProvider = MetaDataMQTTProvider;
