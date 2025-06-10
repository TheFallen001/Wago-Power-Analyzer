/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartService = void 0;
const rxjs_1 = require("rxjs");
const WDXSchema = require("@wago/wdx-schema");
class ChartService {
    constructor(clientService) {
        this._clientService = clientService;
    }
    delete(uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.DeleteRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.ChartDeleteResponse ===
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
    detail(uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.DetailRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.ChartDetailResponse ===
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
    save(item) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.SaveRequest(item);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartSaveResponse &&
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
    list(offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET, limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.ListRequest({
            where: {},
            take: limit,
            skip: offset,
        });
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartListResponse &&
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
    unregister(
    /**
     * Chart uuid
     */
    uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.UnsubscribeRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartUnsubscribeResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(undefined);
                response.complete();
                subscription.unsubscribe();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    register(
    /**
     * Chart uuid
     */
    uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.SubscribeRequest(uuid);
        const response = new rxjs_1.Subject();
        const topic = `${WDXSchema.WDX.Schema.Message.Type.ChartUpdate}-${uuid}`;
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartSubscribeResponse &&
                message.uuid === request.uuid) ||
                (topic === message.topic)) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    configuration(uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.ConfigurationRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .ChartConfigurationResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    data(
    /**
     * Chart uuid
     */
    uuid, dateFrom, dateTo) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.DataRequest(new WDXSchema.WDX.Schema.Model.Chart.DataRequestBody(uuid, dateFrom, dateTo));
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartDataResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    export(uuid, type, dateFrom, dateTo) {
        const request = new WDXSchema.WDX.Schema.Message.Chart.ExportRequest(new WDXSchema.WDX.Schema.Model.Chart.ExportRequestBody(uuid, type, dateFrom, dateTo));
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.ChartExportResponse &&
                message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
                subscription.unsubscribe();
                response.complete();
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
}
exports.ChartService = ChartService;
module.exports = { ChartService };
