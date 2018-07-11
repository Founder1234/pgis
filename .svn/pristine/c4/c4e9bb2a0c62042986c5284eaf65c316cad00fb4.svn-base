/*
|------------------------------------------------------------------------------
|                                Ez.Layer.ImageWMS                
|
|@author: qianleyi
|@date: 2016-10-12
|@descript: 图片型WMS服务构建类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Layer.ImageWMS');

goog.require('ol.layer.Image');
goog.require('ol.source.ImageWMS');

Ez.Layer.ImageWMS = function(options) {
    var opts = options ? options : {};

    var sourceOpts = {
        url: opts.url,
        serverType: opts.serverType ? opts.serverType : 'mapserver',
        params: opts.params ? opts.params : undefined,
        imageLoadFunction: opts.imageLoadFunction ? opts.imageLoadFunction : undefined,
        ratio: opts.ratio ? opts.ratio : undefined,
        projection: opts.projection ? opts.projection : 'EPSG:4326'
    };

    var layerOpts = {
        source: new ol.source.ImageWMS(sourceOpts),
        extent: opts.mbr ? opts.mbr : undefined,
        opacity: opts.opacity ? opts.opacity : 1
    };

    goog.base(this, layerOpts);

};
goog.inherits(Ez.Layer.ImageWMS, ol.layer.Image);

/**
 * 增加图层到地图
 * @param  {Ez.Map} map
 */
Ez.Layer.ImageWMS.prototype.onAdd = function(map) {
    this.map_ = map;
    map.getTileLayerOverlayLayers().getLayers().push(this);
};

/**
 * 移除图层从地图
 * @param  {Ez.Map} map
 */
Ez.Layer.ImageWMS.prototype.onRemove = function(map) {
    this.map_ = null;
    map.getTileLayerOverlayLayers().getLayers().remove(this);
};
