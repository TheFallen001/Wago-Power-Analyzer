/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSchema = void 0;
var uuid_1 = require("uuid");
var DataSchema = /** @class */ (function () {
    function DataSchema(path, relativePath, name, children, metadata, readonly, subscribeable, editable, extendable, removable, refreshable, uuid) {
        if (path === void 0) { path = ''; }
        if (relativePath === void 0) { relativePath = ''; }
        if (name === void 0) { name = ''; }
        if (readonly === void 0) { readonly = false; }
        if (subscribeable === void 0) { subscribeable = false; }
        if (editable === void 0) { editable = false; }
        if (extendable === void 0) { extendable = false; }
        if (removable === void 0) { removable = true; }
        if (refreshable === void 0) { refreshable = false; }
        if (uuid === void 0) { uuid = (0, uuid_1.v4)(); }
        this.path = path;
        this.relativePath = relativePath;
        this.name = name;
        this.children = children;
        this.metadata = metadata;
        this.readonly = readonly;
        this.subscribeable = subscribeable;
        this.editable = editable;
        this.extendable = extendable;
        this.removable = removable;
        this.refreshable = refreshable;
        this.uuid = uuid;
        this.createdTimestamp = (new Date()).getTime();
        this.updateTimestamp = this.createdTimestamp;
    }
    return DataSchema;
}());
exports.DataSchema = DataSchema;
