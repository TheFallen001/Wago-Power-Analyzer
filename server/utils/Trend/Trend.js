/**
 * Elrest eDesign Runtime IPC Typescript Model Data Schema
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trend = void 0;
var XAxis_1 = require("./XAxis");
var YAxis_1 = require("./YAxis");
var DataSet_1 = require("./DataSet");
var Trend = /** @class */ (function () {
    function Trend(id, name, 
    /**
     * Data pool interval
     */
    dataPoolInterval, active, showLines, showLabels, intervalPicker, exportCurrentViewButton, exportFullDataButton, resetButton, legend, tooltips, extendedTouchFeatures, zoom, xAxis, yAxis, dataSet, createDateTime, updatedDateTime) {
        if (dataPoolInterval === void 0) { dataPoolInterval = 1000; }
        if (active === void 0) { active = true; }
        if (showLines === void 0) { showLines = true; }
        if (showLabels === void 0) { showLabels = true; }
        if (xAxis === void 0) { xAxis = new XAxis_1.XAxis(); }
        if (yAxis === void 0) { yAxis = [new YAxis_1.YAxis()]; }
        if (dataSet === void 0) { dataSet = [new DataSet_1.DataSet()]; }
        if (createDateTime === void 0) { createDateTime = Date.now(); }
        if (updatedDateTime === void 0) { updatedDateTime = createDateTime; }
        this.id = id;
        this.name = name;
        this.dataPoolInterval = dataPoolInterval;
        this.active = active;
        this.showLines = showLines;
        this.showLabels = showLabels;
        this.intervalPicker = intervalPicker;
        this.exportCurrentViewButton = exportCurrentViewButton;
        this.exportFullDataButton = exportFullDataButton;
        this.resetButton = resetButton;
        this.legend = legend;
        this.tooltips = tooltips;
        this.extendedTouchFeatures = extendedTouchFeatures;
        this.zoom = zoom;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
        this.dataSet = dataSet;
        this.createDateTime = createDateTime;
        this.updatedDateTime = updatedDateTime;
    }
    return Trend;
}());
exports.Trend = Trend;
