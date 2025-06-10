/**
 * Elrest eDesign Runtime IPC Typescript Model Access User Mode
 *
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(id, username, prename, surname, email, roles, createdDate, updatedDate) {
        this.id = id;
        this.username = username;
        this.prename = prename;
        this.surname = surname;
        this.email = email;
        this.roles = roles;
        this.createdDate = createdDate;
        this.updatedDate = updatedDate;
    }
    return User;
}());
exports.User = User;
