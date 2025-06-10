/**
 * Elrest eDesign Runtime IPC Typescript Model Access Role Mode
 *
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
var Role = /** @class */ (function () {
    function Role(id, name, resources, createdDate, updatedDate) {
        this.id = id;
        this.name = name;
        this.resources = resources;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    return Role;
}());
exports.Role = Role;
