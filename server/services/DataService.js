/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataService = void 0;
const rxjs_1 = require("rxjs");
// Remove AbstractAPIService import and inheritance
// import {AbstractAPIService} from './AbstractAPIService.ts';
const WDXSchema = require("@wago/wdx-schema");
class DataService {
    constructor(clientService) {
        this._clientService = clientService;
    }
    deleteSchema(path) {
        const request = new WDXSchema.WDX.Schema.Message.Data.DeleteSchemaRequest(path);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.DataDeleteSchemaResponse ===
                message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    refreshSchema(path) {
        const request = new WDXSchema.WDX.Schema.Message.Data.RefreshSchemaRequest(path);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type
                .DataRefreshSchemaResponse === message.type &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    setSchema(schema) {
        const request = new WDXSchema.WDX.Schema.Message.Data.SetSchemaRequest(schema);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSetSchemaResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    getSchema(path, level = WDXSchema.WDX.Schema.Model.Data.GetSchemaRequestBody.DEFAULT_LEVEL) {
        const request = new WDXSchema.WDX.Schema.Message.Data.GetSchemaRequest(path, level);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataGetSchemaResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    unregister(path) {
        const request = new WDXSchema.WDX.Schema.Message.Data.UnregisterValueRequest(path);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataUnregisterValueResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(path);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    register(path) {
        const request = new WDXSchema.WDX.Schema.Message.Data.RegisterValueRequest(path);
        const response = new rxjs_1.Subject();
        const topic = `${WDXSchema.WDX.Schema.Message.Type.DataUpdate}-${path}`;
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataRegisterValueResponse &&
                message.uuid === request.uuid) ||
                message.type ===
                    WDXSchema.WDX.Schema.Message.Type.DataUpdate &&
                    message.topic === topic) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    registerDataSchemaChanges() {
        const request = new WDXSchema.WDX.Schema.Message.Data.RegisterSchemaChangesRequest();
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSchemaChanges) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    unregisterDataSchemaChanges() {
        const request = new WDXSchema.WDX.Schema.Message.Data.UnregisterSchemaChangesRequest();
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .DataUnregisterSchemaChangesResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(null);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    getValue(path) {
        const request = new WDXSchema.WDX.Schema.Message.Data.GetValueRequest(path);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataGetValueResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    setValue(path, value) {
        const request = new WDXSchema.WDX.Schema.Message.Data.SetValueRequest(new WDXSchema.WDX.Schema.Model.Data.DataValue(path, value));
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.DataSetValueResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
}
exports.DataService = DataService;
