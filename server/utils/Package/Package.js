/**
 * Elrest eDesign Runtime IPC Typescript Model Package
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
var Status_1 = require("./Status");
var Versions_1 = require("./Versions");
var Package = /** @class */ (function () {
    function Package(id, author, name, description, documentation, license, status, currentVersion, newestVersion, installed, mandatory, versions) {
        if (author === void 0) { author = new Array; }
        if (name === void 0) { name = ''; }
        if (description === void 0) { description = ''; }
        if (documentation === void 0) { documentation = ''; }
        if (license === void 0) { license = ''; }
        if (status === void 0) { status = Status_1.Status.Available; }
        if (currentVersion === void 0) { currentVersion = ''; }
        if (newestVersion === void 0) { newestVersion = ''; }
        if (installed === void 0) { installed = false; }
        if (mandatory === void 0) { mandatory = false; }
        if (versions === void 0) { versions = new Versions_1.Versions; }
        this.id = id;
        this.author = author;
        this.name = name;
        this.description = description;
        this.documentation = documentation;
        this.license = license;
        this.status = status;
        this.currentVersion = currentVersion;
        this.newestVersion = newestVersion;
        this.installed = installed;
        this.mandatory = mandatory;
        this.versions = versions;
    }
    return Package;
}());
exports.Package = Package;
