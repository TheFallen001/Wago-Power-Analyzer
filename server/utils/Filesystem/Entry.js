/**
 * Elrest eDesign Runtime IPC Typescript Model Filesystem Entry
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
var Entry = /** @class */ (function () {
    function Entry(path, name, stats, children, content) {
        if (children === void 0) { children = new Array; }
        this.path = path;
        this.name = name;
        this.stats = stats;
        this.children = children;
        this.content = content;
    }
    return Entry;
}());
exports.Entry = Entry;
