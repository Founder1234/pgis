/*
|------------------------------------------------------------------------------
|                               Ez.TileLayer.SingleHotSpot           
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 单个热点图层
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.SingleHotSpot');

goog.require('Ez.Coordinate');
goog.require('ol.source.SingleHotSpot');

/**
 * 单个热点图层
 * @param {Object} options
 */
Ez.TileLayer.SingleHotSpot = function(options) {

    var opts = options || {};

    //opts['crossOrigin'] = "anonymous";

    var singleHotSpotSource = this.singleSource = new ol.source.SingleHotSpot(opts);

    goog.base(this, {
        source: singleHotSpotSource
    });

    this.set('isAddToMap', false);

    // 当前要进行的更新setTimerout--ID
    this.currentId = null;

    this.clusterStyleCache_ = {};

    this.duration = options.duration ? options.duration : 500;
};
goog.inherits(Ez.TileLayer.SingleHotSpot, ol.layer.Vector);


/**
 * 增加图层到地图上
 * @param  {Ez.Map} map [description]
 * @return {[type]}     [description]
 */
Ez.TileLayer.SingleHotSpot.prototype.onAdd = function(map) {
    this.map_ = map;

    var view = map.getView();
    view.on('change:resolution', this.handleTileData_.bind(this));
    map.getCustomLayers().getLayers().push(this);
    this.set('isAddToMap', true);
};

/**
 * 删除图层
 * @param  {Ez.Map} map [description]
 * @return {[type]}     [description]
 */
Ez.TileLayer.SingleHotSpot.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;
    this.map_ = null;

    var view = map.getView();
    view.off('change:resolution', this.handleTileData_.bind(this));

    var customlayers = map.getCustomLayers().getLayers();

    var currentLayer = this;
    customlayers.forEach(function(ele) {
        if (currentLayer === ele) {
            customlayers.remove(ele);
        }
    });
    this.set('isAddToMap', false);
};

Ez.TileLayer.SingleHotSpot.prototype.updateSourceState = function(loading, end) {
    var source = this.getSource();
    source.setLoadingState(loading);
    source.setLoadendState(end);
};

Ez.TileLayer.SingleHotSpot.prototype.handleTileData_ = function(evt) {
    var source = this.getSource();
    // 1. 清除当前级别的热点数据
    source.clear(true);

    // 2. 立即更改状态，让热点先不加载
    this.updateSourceState(true, false);

    // 2. 清除上一个延迟函数，更新最新的延迟函数
    window.clearTimeout(this.currentId);
    this.currentId = window.setTimeout(function() {
        this.updateSourceState(false, true);
        source.changed();
    }.bind(this), this.duration);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerSingleHotSpot', Ez.TileLayer.SingleHotSpot);
