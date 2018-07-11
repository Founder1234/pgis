/*
|------------------------------------------------------------------------------
|                               Ez.TileLayer.EzMap2010Proj              
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 实现类，用于显示公司2010格式的瓦片地图(地方坐标系，114699)
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.EzMap2010Proj');

goog.require('Ez.TileLayer.Base');
goog.require('ol.source.EzMap2010');

/**
 * 瓦片图层专门用于展示EzMap2010格式数据(地方坐标系)服务
 * @constructor
 * @extends {Ez.TileLayer.Base}
 * @param {String} name        瓦片的图层名，唯一
 * @param {String} url         瓦片图层地址
 * @param {Object} opt_options 瓦片的配置参数
 */
Ez.TileLayer.EzMap2010Proj = function(name, url, opt_options) {

    var opts = opt_options ? opt_options : {};

    /** EzMap2010分辨率 */
    var resolutions = new Array(30);
    for (var z = 9; z >= 0; --z) {
        resolutions[z] = Math.pow(2, (9 - z)) / 256 * 114699;
    }
    for (var z = 10; z <= 30; ++z) {
        resolutions[z] = (1 / Math.pow(2, (z - 9))) / 256 * 114699;
    }

    this.url_ = url;
    var urlTemplate = url + '/EzMap?Service=getImage&Type=RGB&ZoomOffset=0&Col={x}&Row={y}&Zoom={z}&V=0.3&key=' + opts.key;

    var source = new ol.source.EzMap2010({
        url: urlTemplate,
        crossOrigin: opts.crossOrigin,
        resolutions: resolutions,
        wrapX: goog.isDef(opts.wrapX) ? opts.wrapX : true,
        projection: 'EPSG:3857'
    });

    var tileOptions = Object.assign({}, opts, { source: source });

    goog.base(this, name, tileOptions);
};
goog.inherits(Ez.TileLayer.EzMap2010Proj, Ez.TileLayer.Base);

/**
 * 获取瓦片的服务地址
 * @return {String} URL地址
 */
Ez.TileLayer.EzMap2010Proj.prototype.getUrl = function() {
    return this.url_;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerEzMap2010Proj', Ez.TileLayer.EzMap2010Proj);
