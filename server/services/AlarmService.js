/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlarmService = void 0;
const rxjs_1 = require("rxjs");
const WDXSchema = require("@wago/wdx-schema");
class AlarmService {
    constructor(clientService) {
        this._clientService = clientService;
    }
    delete(uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.DeleteRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingDeleteResponse ===
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
    confirmAll() {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest();
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingConfirmResponse ===
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
    confirm(uuid) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingConfirmResponse ===
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
        const request = new WDXSchema.WDX.Schema.Message.Alarm.DetailRequest(uuid);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type.AlarmingDetailResponse ===
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
    save(alarm) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.SetRequest(alarm);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.AlarmingSetResponse &&
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
    list(active, offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET, limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.ListRequest({
            where: {
                active: active,
            },
            take: limit,
            skip: offset,
        });
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type.AlarmingListResponse &&
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
    listAlarmHistory(
    /**
     * Alarm Code
     */
    alarmCode, offset = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET, limit = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.ListHistoryRequest({
            where: {
                number: alarmCode,
            },
            take: limit,
            skip: offset,
        });
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingListHistoryResponse &&
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
    unregister() {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.UnsubscribeRequest();
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingUnsubscribeResponse &&
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
    register() {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.SubscribeRequest();
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if ((message.type ===
                WDXSchema.WDX.Schema.Message.Type
                    .AlarmingSubscribeResponse &&
                message.uuid === request.uuid) ||
                message.type ===
                    WDXSchema.WDX.Schema.Message.Type.AlarmingUpdate) {
                message.error ? response.error(message.error) :
                    response.next(message.body);
            }
        });
        this._clientService.sendMessage(request);
        return response.asObservable();
    }
    getStatus(
    /**
     * Alarm code number
     */
    code) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.GetStatusRequest(code);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingGetStatusResponse === message.type &&
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
    setActive(
    /**
     * Alarm code number
     */
    code) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.SetActiveRequest(code);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingSetActiveResponse === message.type &&
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
    setInactive(
    /**
     * Alarm code number
     */
    code) {
        const request = new WDXSchema.WDX.Schema.Message.Alarm.SetInactiveRequest(code);
        const response = new rxjs_1.Subject();
        const subscription = this._clientService.incommingMessages.subscribe((message) => {
            if (WDXSchema.WDX.Schema.Message.Type
                .AlarmingSetInactiveResponse === message.type &&
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
exports.AlarmService = AlarmService;
module.exports = { AlarmService };
