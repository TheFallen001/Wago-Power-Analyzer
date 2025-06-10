/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

'use strict';

import {Observable, skip, Subject, Subscription, take} from 'rxjs';
import * as WDXSchema from '@wago/wdx-schema';

export class AlarmService {
  private _clientService: any;
  constructor(clientService?: any) {
    this._clientService = clientService;
  }

  public delete(uuid: string):
      Observable<WDXSchema.WDX.Schema.Model.Alarm.Alarm> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.DeleteRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.DeleteRequest(uuid);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public confirmAll(): Observable<null> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest();

    const response: Subject<null> = new Subject<null>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public confirm(uuid: string): Observable<null> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.ConfirmRequest(uuid);

    const response: Subject<null> = new Subject<null>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public detail(uuid: string):
      Observable<WDXSchema.WDX.Schema.Model.Alarm.Alarm> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.DetailRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.DetailRequest(uuid);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public save(alarm: WDXSchema.WDX.Schema.Model.Alarm.Alarm):
      Observable<WDXSchema.WDX.Schema.Model.Alarm.Alarm> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.SetRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.SetRequest(alarm);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public list(
      active?: boolean,
      offset:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET,
      limit:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT,
      ): Observable<WDXSchema.WDX.Schema.Model.Pagination
                        .Response<WDXSchema.WDX.Schema.Model.Alarm.Alarm>> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.ListRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.ListRequest(
            {
              where:{
                active: active,
              },
              take:limit,
              skip: offset,
            }
        );

    const response: Subject<WDXSchema.WDX.Schema.Model.Pagination.Response<
        WDXSchema.WDX.Schema.Model.Alarm.Alarm>> =
        new Subject<WDXSchema.WDX.Schema.Model.Pagination
                        .Response<WDXSchema.WDX.Schema.Model.Alarm.Alarm>>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type.AlarmingListResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);

                response.complete();
                subscription.unsubscribe();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public listAlarmHistory(
      /**
       * Alarm Code
       */
      alarmCode: number|undefined,
      offset:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET,
      limit:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT,
      ):
      Observable<WDXSchema.WDX.Schema.Model.Pagination
                     .Response<WDXSchema.WDX.Schema.Model.Alarm.AlarmHistory>> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.ListHistoryRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.ListHistoryRequest(
            {
              where:{
                number: alarmCode,
              },
              take:limit,
              skip: offset,
            },
        );

    const response:
        Subject<WDXSchema.WDX.Schema.Model.Pagination
                    .Response<WDXSchema.WDX.Schema.Model.Alarm.AlarmHistory>> =
            new Subject<WDXSchema.WDX.Schema.Model.Pagination.Response<
                WDXSchema.WDX.Schema.Model.Alarm.AlarmHistory>>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type
                          .AlarmingListHistoryResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);

                response.complete();
                subscription.unsubscribe();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public unregister(): Observable<undefined> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.UnsubscribeRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.UnsubscribeRequest();

    const response = new Subject<undefined>();
    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public register():
      Observable<WDXSchema.WDX.Schema.Model.Alarm.Alarm|undefined> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.SubscribeRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.SubscribeRequest();

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm|undefined> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.Alarm|undefined>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if ((message.type ===
                       WDXSchema.WDX.Schema.Message.Type
                           .AlarmingSubscribeResponse &&
                   message.uuid === request.uuid) ||
                  message.type ===
                      WDXSchema.WDX.Schema.Message.Type.AlarmingUpdate) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public getStatus(
      /**
       * Alarm code number
       */
      code: number,
      ): Observable<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.GetStatusRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.GetStatusRequest(code);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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
  public setActive(
      /**
       * Alarm code number
       */
      code: number,
      ): Observable<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.SetActiveRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.SetActiveRequest(code);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public setInactive(
      /**
       * Alarm code number
       */
      code: number,
      ): Observable<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> {
    const request: WDXSchema.WDX.Schema.Message.Alarm.SetInactiveRequest =
        new WDXSchema.WDX.Schema.Message.Alarm.SetInactiveRequest(code);

    const response: Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus> =
        new Subject<WDXSchema.WDX.Schema.Model.Alarm.AlarmStatus>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (WDXSchema.WDX.Schema.Message.Type
                          .AlarmingSetInactiveResponse === message.type &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);

                response.complete();
                subscription.unsubscribe();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }
}

module.exports = { AlarmService };
