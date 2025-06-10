/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

'use strict';

import {Observable, Subject, Subscription} from 'rxjs';
import * as WDXSchema from '@wago/wdx-schema';

export class ChartService {
  private _clientService: any;
  constructor(clientService?: any) {
    this._clientService = clientService;
  }

  public delete(uuid: string):
      Observable<WDXSchema.WDX.Schema.Model.Chart.Chart> {
    const request: WDXSchema.WDX.Schema.Message.Chart.DeleteRequest =
        new WDXSchema.WDX.Schema.Message.Chart.DeleteRequest(uuid);

    const response: Subject<WDXSchema.WDX.Schema.Model.Chart.Chart> =
        new Subject<WDXSchema.WDX.Schema.Model.Chart.Chart>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (WDXSchema.WDX.Schema.Message.Type.ChartDeleteResponse ===
                      message.type &&
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

  public detail(uuid: string):
      Observable<WDXSchema.WDX.Schema.Model.Chart.Chart> {
    const request: WDXSchema.WDX.Schema.Message.Chart.DetailRequest =
        new WDXSchema.WDX.Schema.Message.Chart.DetailRequest(uuid);

    const response: Subject<WDXSchema.WDX.Schema.Model.Chart.Chart> =
        new Subject<WDXSchema.WDX.Schema.Model.Chart.Chart>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (WDXSchema.WDX.Schema.Message.Type.ChartDetailResponse ===
                      message.type &&
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

  public save(item: WDXSchema.WDX.Schema.Model.Chart.Chart):
      Observable<WDXSchema.WDX.Schema.Model.Chart.Chart> {
    const request: WDXSchema.WDX.Schema.Message.Chart.SaveRequest =
        new WDXSchema.WDX.Schema.Message.Chart.SaveRequest(item);

    const response: Subject<WDXSchema.WDX.Schema.Model.Chart.Chart> =
        new Subject<WDXSchema.WDX.Schema.Model.Chart.Chart>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public list(
      offset:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_OFFSET,
      limit:
          number = WDXSchema.WDX.Schema.Model.Pagination.Request.DEFAULT_LIMIT,
      ): Observable<WDXSchema.WDX.Schema.Model.Pagination
                        .Response<WDXSchema.WDX.Schema.Model.Chart.Chart>> {
    const request: WDXSchema.WDX.Schema.Message.Chart.ListRequest =
        new WDXSchema.WDX.Schema.Message.Chart.ListRequest({
          where: {},
          take: limit,
          skip: offset,
        });

    const response: Subject<WDXSchema.WDX.Schema.Model.Pagination.Response<
        WDXSchema.WDX.Schema.Model.Chart.Chart>> =
        new Subject<WDXSchema.WDX.Schema.Model.Pagination
                        .Response<WDXSchema.WDX.Schema.Model.Chart.Chart>>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type.ChartListResponse &&
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

  public unregister(
      /**
       * Chart uuid
       */
      uuid: string,

      ): Observable<undefined> {
    const request: WDXSchema.WDX.Schema.Message.Chart.UnsubscribeRequest =
        new WDXSchema.WDX.Schema.Message.Chart.UnsubscribeRequest(uuid);

    const response = new Subject<undefined>();
    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type
                          .ChartUnsubscribeResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(undefined);

                response.complete();
                subscription.unsubscribe();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public register(
      /**
       * Chart uuid
       */
      uuid: string,

      ):
      Observable<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData|undefined> {
    const request: WDXSchema.WDX.Schema.Message.Chart.SubscribeRequest =
        new WDXSchema.WDX.Schema.Message.Chart.SubscribeRequest(uuid);

    const response:
        Subject<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData|undefined> =
            new Subject<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData|
                        undefined>();

    const topic: string =
        `${WDXSchema.WDX.Schema.Message.Type.ChartUpdate}-${uuid}`;

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if ((message.type ===
                       WDXSchema.WDX.Schema.Message.Type
                           .ChartSubscribeResponse &&
                   message.uuid === request.uuid) ||
                  (topic === message.topic)) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public configuration(uuid: string):
      Observable<WDXSchema.WDX.Schema.Model.Chart.Configuration> {
    const request: WDXSchema.WDX.Schema.Message.Chart.ConfigurationRequest =
        new WDXSchema.WDX.Schema.Message.Chart.ConfigurationRequest(uuid);

    const response: Subject<WDXSchema.WDX.Schema.Model.Chart.Configuration> =
        new Subject<WDXSchema.WDX.Schema.Model.Chart.Configuration>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type
                          .ChartConfigurationResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
                subscription.unsubscribe();
                response.complete();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public data(

      /**
       * Chart uuid
       */
      uuid: string,

      dateFrom?: number,
      dateTo?: number,
      ): Observable<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData> {
    const request: WDXSchema.WDX.Schema.Message.Chart.DataRequest =
        new WDXSchema.WDX.Schema.Message.Chart.DataRequest(
            new WDXSchema.WDX.Schema.Model.Chart.DataRequestBody(
                uuid,
                dateFrom,
                dateTo,
                ),
        );

    const response:
        Subject<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData> =
            new Subject<WDXSchema.WDX.Schema.Model.Chart.ConfigurationData>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type.ChartDataResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
                subscription.unsubscribe();
                response.complete();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public export(
      uuid: string,
      type: WDXSchema.WDX.Schema.Model.Chart.Export.Type,
      dateFrom?: number,
      dateTo?: number,
      ): Observable<string> {
    const request: WDXSchema.WDX.Schema.Message.Chart.ExportRequest =
        new WDXSchema.WDX.Schema.Message.Chart.ExportRequest(
            new WDXSchema.WDX.Schema.Model.Chart.ExportRequestBody(
                uuid,
                type,
                dateFrom,
                dateTo,
                ),
        );

    const response: Subject<string> = new Subject<string>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type.ChartExportResponse &&
                  message.uuid === request.uuid) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
                subscription.unsubscribe();
                response.complete();
              }
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }
}

module.exports = { ChartService };
