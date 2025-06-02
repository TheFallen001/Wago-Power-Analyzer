/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

'use strict';

import {Observable, Subject, Subscription} from 'rxjs';
// Remove AbstractAPIService import and inheritance
// import {AbstractAPIService} from './AbstractAPIService.ts';
import * as WDXSchema from '@wago/wdx-schema';

export class DataService {
  private _clientService: any;
  constructor(clientService?: any) {
    this._clientService = clientService;
  }

  public deleteSchema(path: string): Observable<string> {
    const request: WDXSchema.WDX.Schema.Message.Data.DeleteSchemaRequest =
        new WDXSchema.WDX.Schema.Message.Data.DeleteSchemaRequest(path);

    const response: Subject<string> = new Subject<string>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public refreshSchema(path: string): Observable<string> {
    const request: WDXSchema.WDX.Schema.Message.Data.RefreshSchemaRequest =
        new WDXSchema.WDX.Schema.Message.Data.RefreshSchemaRequest(path);

    const response: Subject<string> = new Subject<string>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public setSchema(schema: WDXSchema.WDX.Schema.Model.Data.DataSchema):
      Observable<WDXSchema.WDX.Schema.Model.Data.DataSchema> {
    const request: WDXSchema.WDX.Schema.Message.Data.SetSchemaRequest =
        new WDXSchema.WDX.Schema.Message.Data.SetSchemaRequest(schema);

    const response: Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema> =
        new Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public getSchema(
      path: string,
      level: number =
          WDXSchema.WDX.Schema.Model.Data.GetSchemaRequestBody.DEFAULT_LEVEL,
      ): Observable<WDXSchema.WDX.Schema.Model.Data.DataSchema> {
    const request: WDXSchema.WDX.Schema.Message.Data.GetSchemaRequest =
        new WDXSchema.WDX.Schema.Message.Data.GetSchemaRequest(path, level);

    const response: Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema> =
        new Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                      WDXSchema.WDX.Schema.Message.Type.DataGetSchemaResponse &&
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

  public unregister(path: string): Observable<string> {
    const request: WDXSchema.WDX.Schema.Message.Data.UnregisterValueRequest =
        new WDXSchema.WDX.Schema.Message.Data.UnregisterValueRequest(path);

    const response = new Subject<string>();
    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public register(
      path: string,
      ): Observable<WDXSchema.WDX.Schema.Model.Data.DataValue|null> {
    const request: WDXSchema.WDX.Schema.Message.Data.RegisterValueRequest =
        new WDXSchema.WDX.Schema.Message.Data.RegisterValueRequest(path);

    const response: Subject<WDXSchema.WDX.Schema.Model.Data.DataValue> =
        new Subject<WDXSchema.WDX.Schema.Model.Data.DataValue>();

    const topic = `${WDXSchema.WDX.Schema.Message.Type.DataUpdate}-${path}`;

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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
            },
        );

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public registerDataSchemaChanges():
      Observable<WDXSchema.WDX.Schema.Model.Data.DataSchema> {
    const request:
        WDXSchema.WDX.Schema.Message.Data.RegisterSchemaChangesRequest =
        new WDXSchema.WDX.Schema.Message.Data.RegisterSchemaChangesRequest();

    const response: Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema> =
        new Subject<WDXSchema.WDX.Schema.Model.Data.DataSchema>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
              if (message.type ===
                  WDXSchema.WDX.Schema.Message.Type.DataSchemaChanges) {
                message.error ? response.error(message.error) :
                                response.next(message.body);
              }
            });

    this._clientService.sendMessage(request);

    return response.asObservable();
  }

  public unregisterDataSchemaChanges(): Observable<null> {
    const request:
        WDXSchema.WDX.Schema.Message.Data.UnregisterSchemaChangesRequest =
        new WDXSchema.WDX.Schema.Message.Data.UnregisterSchemaChangesRequest();

    const response = new Subject<null>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public getValue(path: string):
      Observable<WDXSchema.WDX.Schema.Model.Data.DataValue|null> {
    const request = new WDXSchema.WDX.Schema.Message.Data.GetValueRequest(path);
    const response = new Subject<WDXSchema.WDX.Schema.Model.Data.DataValue>();
    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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

  public setValue(path: string, value: any):
      Observable<WDXSchema.WDX.Schema.Model.Data.DataValue|null> {
    const request: WDXSchema.WDX.Schema.Message.Data.SetValueRequest =
        new WDXSchema.WDX.Schema.Message.Data.SetValueRequest(
            new WDXSchema.WDX.Schema.Model.Data.DataValue(path, value));

    const response: Subject<WDXSchema.WDX.Schema.Model.Data.DataValue|null> =
        new Subject<WDXSchema.WDX.Schema.Model.Data.DataValue|null>();

    const subscription: Subscription =
        this._clientService.incommingMessages.subscribe(
            (message: WDXSchema.WDX.Schema.Message.AbstractMessage) => {
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
