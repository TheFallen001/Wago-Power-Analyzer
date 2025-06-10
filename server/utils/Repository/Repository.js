/**
 * Elrest eDesign Runtime IPC Typescript Model Repository
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
var Repository = /** @class */ (function () {
    function Repository(id, name, url, authentication, packages) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.authentication = authentication;
        this.packages = packages;
    }
    return Repository;
}());
exports.Repository = Repository;
