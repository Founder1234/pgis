/*
|---------------------------------- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
|
Ez.TileLayer.WMTS                
|
|@author: qianleyi
|@date: 2016-10-08
|@descript: 标准WMTS瓦片服务图层构建类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.WMTS');

goog.require('Ez.TileLayer.Base');

/**
 * WMTS服务瓦片图层构建类
 * @param {String} name        图层名
 * @param {String} url         url模板
 * @param {Object} opt_options 图层配置参数
 */
Ez.TileLayer.WMTS = function(name, url, opt_options) {
    var opts = opt_options ? opt_options : {};

    this.url_ = url;
    /** 天地图分辨率 */
    var resolutions = new Array(30);
    var matrixIds = new Array(30);
    for (var z = 0; z < 30; ++z) {
        resolutions[z] = 360 / (256 * Math.pow(2, z));
        matrixIds[z] = z;
    }

    /**
     * wmts tilegrid
     */
    var tileGrid = new ol.tilegrid.WMTS({
        origin: [-180, 90],
        resolutions: resolutions,
        matrixIds: matrixIds
    });

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
goog.inherits(Ez.TileLayer.WMTS, Ez.TileLayer.Base);

/**
 * 获取瓦片的服务地址
 * @return {String} URL地址
 */
Ez.TileLayer.WMTS.prototype.getUrl = function() {
    return this.url_;
};
