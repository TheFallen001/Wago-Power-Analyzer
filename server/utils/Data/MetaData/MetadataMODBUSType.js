/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema MetaData MODBUS Type
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetadataMODBUSType = void 0;
var MetadataMODBUSType;
(function (MetadataMODBUSType) {
    /**
     * Unsigned Integer 16 - Big Endian
     */
    MetadataMODBUSType["UINT16_BE"] = "UINT16_BE";
    /**
     * Unsigned Integer 16 Little Endian
     */
    MetadataMODBUSType["UINT16_LE"] = "UINT16_LE";
    /**
     * Signed Integer 16 - Big Endian
     */
    MetadataMODBUSType["INT16_BE"] = "INT16_BE";
    /**
     * Signed Integer 16 - Little Endian
     */
    MetadataMODBUSType["INT16_LE"] = "INT16_LE";
    /**
     * Float 32 - Big Endian
     */
    MetadataMODBUSType["FLOAT32_BE"] = "FLOAT32_BE";
    /**
     * Float 32 - Big Endian - Reversed
     */
    MetadataMODBUSType["FLOAT32_BE_RE"] = "FLOAT32_BE_RE";
    /**
     * Float 32 - Little Endian
     */
    MetadataMODBUSType["FLOAT32_LE"] = "FLOAT32_LE";
    /**
     * Float 32 - Little Endian - Reversed
     */
    MetadataMODBUSType["FLOAT32_LE_RE"] = "FLOAT32_LE_RE";
    /**
     * String - Little Endian
     */
    MetadataMODBUSType["STRING_LE"] = "STRING_LE";
    /**
     * String - Little Endian - Reversed
     */
    MetadataMODBUSType["STRING_LE_RE"] = "STRING_LE_RE";
})(MetadataMODBUSType || (exports.MetadataMODBUSType = MetadataMODBUSType = {}));
