/*
|------------------------------------------------------------------------------
|                               Ez.TileLayer.XYZ                
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 增加XYZ字符模板的瓦片图层类型
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.XYZ');

goog.require('Ez.TileLayer.Base');

/**
 * 瓦片图层专门用于展示XYZ服务格式的地图
 * @constructor
 * @extends {Ez.TileLayer.Base}
 * @param {String} name        瓦片的图层名，唯一
 * @param {String} url         瓦片图层地址
 * @param {Object} opt_options 瓦片的配置参数
 */
Ez.TileLayer.XYZ = function(name, url, opt_options) {

    var opts = opt_options ? opt_options : {};

    this.url_ = url;

    /**
     * 定义数据源
     */
    var source = new ol.source.XYZ({
        url: this.url_,
        crossOrigin: opts.crossOrigin,
        projection: opts.projection,
        tileGrid: opts.tileGrid,
        maxZoom: opts.maxZoom,
        minZoom: opts.minZoom,
        tileSize: opts.tileSize,
        wrapX: goog.isDef(opts.wrapX) ? opts.wrapX : true,
        attributions: opts.attributions
    });

    var tileOptions = Object.assign({}, opts, { source: source });

    goog.base(this, name, tileOptions);
};
goog.inherits(Ez.TileLayer.XYZ, Ez.TileLayer.Base);

/**
 * 获取瓦片的服务地址
 * @return {String} URL地址
 */
Ez.TileLayer.XYZ.prototype.getUrl = function() {
    return this.url_;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerXYZ', Ez.TileLayer.XYZ);
