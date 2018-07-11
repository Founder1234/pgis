/*
|------------------------------------------------------------------------------
|                         Ez.controls.ScaleLine                
|
|@author: qianleyi
|@date: 2016-08-02
|@descript: 地图控件——比例尺
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.ScaleLine');

goog.require('ol.control.ScaleLine');

/**
 * 地图比例尺控件类
 * @param {[type]} options [description]
 */
Ez.controls.ScaleLine = function(options) {
    var opts = options ? options : {};

    var className = opts.className ? opts.className : 'ez-scale-line';

    var minWidth = opts.minWidth ? opts.minWidth : 64;

    var units = opts.units ? opts.units : 'metric';

    goog.base(this, {
        className: className,
        minWidth: minWidth,
        units: units
    });
};
goog.inherits(Ez.controls.ScaleLine, ol.control.ScaleLine);
