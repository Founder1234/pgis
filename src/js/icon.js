/*
|------------------------------------------------------------------------------
|								Ez.Icon.js				
|
|@author: qianleyi
|@date: 2015-12-17
|@descript: 基于EzServerClient的地图图标样式控制
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Icon');
goog.provide('Ez.style.IconAnchorUnits');

goog.require('ol.style.Icon');

/**
 * Icon anchor units. One of 'fraction', 'pixels'.
 * @enum {string}
 */
Ez.style.IconAnchorUnits = {
    FRACTION: 'fraction',
    PIXELS: 'pixels'
};

/**
 * [Icon description]
 * @param {Ezx.style.IconOptions} [opt_styleOptions]
 * @extends {ol.style.Icon}
 * @constructor
 */
Ez.Icon = function(opt_styleOptions) {
    var opts = opt_styleOptions ? opt_styleOptions : {};
    goog.base(this, opts);
    this.iconOpts = opts;
};
goog.inherits(Ez.Icon, ol.style.Icon);


Ez.Icon.prototype.getOptions = function() {
    return this.iconOpts;
};


// 以下为需要保留的类名以及方法
goog.exportSymbol('EzIcon', Ez.Icon);
