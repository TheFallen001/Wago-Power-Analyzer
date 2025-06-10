/**
 * Elrest eDesign Runtime Library Messages Model Instance Application Module
 * ServerOpts Implementation
 *
 * @copyright 2024 Elrest AutomationsSysteme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceOptions = void 0;
var DataSourceOptions = /** @class */ (function () {
    function DataSourceOptions(name, type, host, port, username, password, database) {
        this.name = name;
        this.type = type;
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.database = database;
    }
    return DataSourceOptions;
}());
exports.DataSourceOptions = DataSourceOptions;
