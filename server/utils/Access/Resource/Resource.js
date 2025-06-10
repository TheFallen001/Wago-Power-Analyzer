/**
 * Elrest eDesign Runtime IPC Typescript Model Access User Mode
 *
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
var Resource = /** @class */ (function () {
    function Resource(id, name, path, createdDate, updatedDate) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    return Resource;
}());
exports.Resource = Resource;
