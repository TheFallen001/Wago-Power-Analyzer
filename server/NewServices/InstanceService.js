/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError(
          "Class extends value " + String(b) + " is not a constructor or null"
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceService = void 0;
var rxjs_1 = require("rxjs");
var _1 = require(".");
var WDXSchema = require("@wago/wdx-schema");
var InstanceService = /** @class */ (function (_super) {
  __extends(InstanceService, _super);
  function InstanceService() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * Starts eDesign Instance instance
   */
  InstanceService.prototype.delete = function (uuid) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.DeleteRequest(uuid);
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceDeleteResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  InstanceService.prototype.logSubscribe = function (uuid) {
    var request =
      new WDXSchema.WDX.Schema.Message.Instance.LogSubscribeRequestMessage(
        uuid
      );
    var response = new rxjs_1.Subject();
    var topic = ""
      .concat(WDXSchema.WDX.Schema.Message.Type.InstanceLog, "-")
      .concat(uuid);
    this._clientService.incommingMessages.subscribe(function (message) {
      if (
        /** Subscribe response */
        (message.type ===
          WDXSchema.WDX.Schema.Message.Type.InstanceLogSubscribeResponse &&
          message.uuid === request.uuid) ||
        /** Monitoring Message */
        (message.type === WDXSchema.WDX.Schema.Message.Type.InstanceLog &&
          topic === message.topic)
      ) {
        message.error
          ? response.error(message.error)
          : response.next(message.body);
      }
    });
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  InstanceService.prototype.logUnsubscribe = function (uuid) {
    var request =
      new WDXSchema.WDX.Schema.Message.Instance.LogUnsubscribeRequestMessage(
        uuid
      );
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceLogUnsubscribeResponse &&
          request.uuid === message.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Lists eDesign Instances
   *
   */
  InstanceService.prototype.list = function (conditions) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.ListRequest(
      conditions
    );
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceListResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Starts eDesign Instance instance
   */
  InstanceService.prototype.start = function (uuid) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.StartRequest(uuid);
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceStartResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  InstanceService.prototype.detail = function (uuid) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.DetailRequest(uuid);
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceDetailResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Stops eDesign Runtime Instance
   */
  InstanceService.prototype.stop = function (uuid) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.StopRequest(uuid);
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceStopResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Restart eDesign Instance instance
   */
  InstanceService.prototype.restart = function (uuid) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.RestartRequest(
      uuid
    );
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceRestartResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Request WDX Whois Instance information
   */
  InstanceService.prototype.whois = function (
    /**
     * Instance name
     */
    name
  ) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.WhoIsRequest(name);
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceWhoIsResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  /**
   * Save eDesign Instance
   */
  InstanceService.prototype.save = function (instance) {
    var request = new WDXSchema.WDX.Schema.Message.Instance.SaveRequest(
      instance
    );
    var response = new rxjs_1.Subject();
    var subscription = this._clientService.incommingMessages.subscribe(
      function (message) {
        if (
          message.type ===
            WDXSchema.WDX.Schema.Message.Type.InstanceSaveResponse &&
          message.uuid === request.uuid
        ) {
          message.error
            ? response.error(message.error)
            : response.next(message.body);
          response.complete();
          subscription.unsubscribe();
        }
      }
    );
    this._clientService.sendMessage(request);
    return response.asObservable();
  };
  return InstanceService;
})(_1.AbstractAPIService);
exports.InstanceService = InstanceService;
