/*
|------------------------------------------------------------------------------
|                               Ez.TileLayer.TDT                
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 实现类，用于显示天地图格式的瓦片地图
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.TDT');

goog.require('Ez.TileLayer.Base');

/**
 * 瓦片图层专门用于展示天地图数据服务
 * @constructor
 * @extends {Ez.TileLayer.Base}
 * @param {String} name        瓦片的图层名，唯一
 * @param {String} url         瓦片图层地址
 * @param {Object} opt_options 瓦片的配置参数
 */
Ez.TileLayer.TDT = function(name, url, opt_options) {

    var opts = opt_options ? opt_options : {};

    this.url_ = url;
    var urlTemplate = url + '/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=' + opts.key;

    /**
     * 定义数据源
     */
    var source = new ol.source.XYZ({
        url: urlTemplate,
        crossOrigin: opts.crossOrigin,
        wrapX: goog.isDef(opts.wrapX) ? opts.wrapX : true,
        cacheSize: opts.cacheSize ? opts.cacheSize : 2048,
        tileLoadFunction: opts.tileLoadFunction ? opts.tileLoadFunction : undefined,
        projection: 'EPSG:4326'
    });

    var tileOptions = Object.assign({}, opts, { source: source });

    goog.base(this, name, tileOptions);
};
goog.inherits(Ez.TileLayer.TDT, Ez.TileLayer.Base);

/**
 * 获取瓦片的服务地址
 * @return {String} URL地址
 */
Ez.TileLayer.TDT.prototype.getUrl = function() {
    return this.url_;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerTDT', Ez.TileLayer.TDT);
