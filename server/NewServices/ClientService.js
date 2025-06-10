/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = exports.Status = void 0;
var DataService_1 = require("./DataService");
var ScriptService_1 = require("./ScriptService");
var InstanceService_1 = require("./InstanceService");
var RuntimeService_1 = require("./RuntimeService");
var AlarmService_1 = require("./AlarmService");
var WDXWS = require("websocket");
var WDXSchema = require("@wago/wdx-schema");
var rxjs_1 = require("rxjs");
var TrendService_1 = require("./TrendService");
var ChartService_1 = require("./ChartService");
/**
 * @todo Multiple connect create isolated subscription on status,
 */
var Status;
(function (Status) {
    Status["CONNECTED"] = "CONNECTED";
    Status["CONNECTING"] = "CONNECTING";
    Status["DISCONNECTED"] = "DISCONNECTED";
})(Status || (exports.Status = Status = {}));
var ClientService = /** @class */ (function () {
    function ClientService(wsClientConfiguration) {
        this.__KEEPALIVE_INTERVAL = 60000;
        this.__RECONNECT_TIMEOUT = 1000;
        this.__status = new rxjs_1.BehaviorSubject(Status.DISCONNECTED);
        this.__incommingMessages = new rxjs_1.Subject();
        this.__wsClientConfiguration = wsClientConfiguration;
    }
    ClientService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            if (Status.CONNECTED === _this.status.getValue()) {
                                resolve();
                                return;
                            }
                            else if (Status.CONNECTING === _this.status.getValue()) {
                                _this.status.subscribe({
                                    next: function (status) {
                                        if (Status.CONNECTED === status) {
                                            resolve();
                                        }
                                        else if (Status.DISCONNECTED === status) {
                                            reject('Not connected');
                                        }
                                    },
                                    error: function (error) {
                                        reject(error);
                                    }
                                });
                                return;
                            }
                            _this.__status.next(Status.CONNECTING);
                            _this.__wsClient = new WDXWS.client();
                            _this.__wsClient.on('connect', function (connection) {
                                _this.__onOpen(connection);
                                resolve();
                            });
                            _this.__wsClient.on('connectFailed', function (error) {
                                _this.__onError(error);
                                reject(error);
                            });
                            _this.__wsClient.connect(_this.__getWsClientUrl());
                        }
                        catch (error) {
                            reject(error);
                        }
                    })];
            });
        });
    };
    ClientService.prototype.__getWsClientUrl = function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return ((_a = this.__wsClientConfiguration) === null || _a === void 0 ? void 0 : _a.url) ?
            (_b = this.__wsClientConfiguration) === null || _b === void 0 ? void 0 : _b.url :
            "".concat((_c = this.__wsClientConfiguration) === null || _c === void 0 ? void 0 : _c.protocol, "://").concat((_d = this.__wsClientConfiguration) === null || _d === void 0 ? void 0 : _d.host, ":").concat((_e = this.__wsClientConfiguration) === null || _e === void 0 ? void 0 : _e.port).concat((_g = (_f = this.__wsClientConfiguration) === null || _f === void 0 ? void 0 : _f.path) !== null && _g !== void 0 ? _g : '');
    };
    ClientService.prototype.__sendKeepAlive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sendMessage(new WDXSchema.WDX.Schema.Message.KeepAlive())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ClientService.prototype.__startKeepAlive = function () {
        var _this = this;
        if (undefined === this.__keepAliveTimeout) {
            this.__keepAliveTimeout = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.__sendKeepAlive()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, this.__KEEPALIVE_INTERVAL);
            this.__keepAliveTimeout.unref();
        }
    };
    ClientService.prototype.__stopKeepAlive = function () {
        if (undefined !== this.__keepAliveTimeout) {
            clearTimeout(this.__keepAliveTimeout);
            this.__keepAliveTimeout = undefined;
        }
    };
    ClientService.prototype.__onOpen = function (connection) {
        var _this = this;
        this.__connection = connection;
        this.__connection.on('error', function (error) { });
        this.__connection.on('close', function (code, desc) {
            _this.__status.next(Status.DISCONNECTED);
            _this.__stopKeepAlive();
            if (1000 !== code) {
                _this.__reconnect();
            }
        });
        this.__connection.on('message', function (message) {
            _this.__onMessage(message);
        });
        this.__status.next(Status.CONNECTED);
        this.__startKeepAlive();
    };
    ClientService.prototype.__reconnect = function () {
        var _this = this;
        var _a, _b;
        console.error("Reconnecting after ".concat(this.__RECONNECT_TIMEOUT, "ms"));
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        this.__reconnect();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, (_b = (_a = this.__wsClientConfiguration) === null || _a === void 0 ? void 0 : _a.reconnectTimeout) !== null && _b !== void 0 ? _b : this.__RECONNECT_TIMEOUT);
    };
    ClientService.prototype.__onError = function (error) {
        this.__status.next(Status.DISCONNECTED);
        console.error('Client error ' + error.message);
    };
    ClientService.prototype.__onMessage = function (message) {
        this.__incommingMessages.next(JSON.parse(message.utf8Data));
    };
    ClientService.prototype.sendMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        try {
                            var data = JSON.stringify(message);
                            (_a = _this.__connection) === null || _a === void 0 ? void 0 : _a.send(data, function () {
                                resolve();
                            });
                        }
                        catch (err) {
                            reject();
                        }
                    })];
            });
        });
    };
    ClientService.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                (_a = this.__connection) === null || _a === void 0 ? void 0 : _a.close();
                this.__connection = undefined;
                this.__wsClient = undefined;
                return [2 /*return*/];
            });
        });
    };
    Object.defineProperty(ClientService.prototype, "status", {
        get: function () {
            return this.__status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "incommingMessages", {
        get: function () {
            return this.__incommingMessages;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "alarmService", {
        get: function () {
            if (undefined === this.__alarmService) {
                this.__alarmService = new AlarmService_1.AlarmService(this);
            }
            return this.__alarmService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "chartService", {
        get: function () {
            if (undefined === this.__chartService) {
                this.__chartService = new ChartService_1.ChartService(this);
            }
            return this.__chartService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "trendService", {
        get: function () {
            if (undefined === this.__trendService) {
                this.__trendService = new TrendService_1.TrendService(this);
            }
            return this.__trendService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "dataService", {
        get: function () {
            if (undefined === this.__dataService) {
                this.__dataService = new DataService_1.DataService(this);
            }
            return this.__dataService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "scriptService", {
        get: function () {
            if (undefined === this.__scriptService) {
                this.__scriptService = new ScriptService_1.ScriptService(this);
            }
            return this.__scriptService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "instanceService", {
        get: function () {
            if (undefined === this.__instanceService) {
                this.__instanceService = new InstanceService_1.InstanceService(this);
            }
            return this.__instanceService;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClientService.prototype, "runtimeService", {
        get: function () {
            if (undefined === this.__runtimeService) {
                this.__runtimeService = new RuntimeService_1.RuntimeService(this);
            }
            return this.__runtimeService;
        },
        enumerable: false,
        configurable: true
    });
    return ClientService;
}());
exports.ClientService = ClientService;
