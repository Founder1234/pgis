/*
|------------------------------------------------------------------------------
|                               Ez.TileLayer.MultiHotSpot              
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 多源热点图层集合类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.MultiHotSpot');

goog.require('Ez.TileLayer.SingleHotSpot');
goog.require('ol.layer.Group');

Ez.TileLayer.MultiHotSpot = function (options) {

    goog.base(this, options);

    this.currentId = null;

    this.duration = options.duration ? options.duration : 500;
};
goog.inherits(Ez.TileLayer.MultiHotSpot, ol.layer.Group);

/**
 * 增加单个热点图层到集合中
 * @param {EzTileLayerSingleHotSpot} layer [description]
 */
Ez.TileLayer.MultiHotSpot.prototype.addSingleLayer = function (layer) {
    this.getLayers().push(layer);
};

/**
 * 删除单个热点图层
 * @param  {EzTileLayerSingleHotSpot} layer
 */
Ez.TileLayer.MultiHotSpot.prototype.deleteSingleLayer = function (layer) {
    var layers = this.getLayers();

    layers.forEach(function (ele) {
        if (layer === ele) {
            layers.remove(ele);
            return;
        }
    });
};

Ez.TileLayer.MultiHotSpot.prototype.handleTileData_ = function () {
    var layers = this.getLayers();

    layers.forEach(function (e) {
        // 1. 清除当前级别的热点数据
        e.getSource().clear();

        // 2. 立即更改状态，让热点先不加载
        if (e.updateSopurceState) e.updateSopurceState(true, false);
    });

    // 3. 清除上一个延迟函数，更新最新的延迟函数
    window.clearTimeout(this.currentId);
    this.currentId = window.setTimeout(function () {
        layers.forEach(function (e) {
            if (e.updateSopurceState) e.updateSopurceState(false, true);
            e.getSource().changed();
        });
    }.bind(this), this.duration);
};

/**
 * 增加到地图
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
Ez.TileLayer.MultiHotSpot.prototype.onAdd = function (map) {

    this.map_ = map;

    var view = map.getView();
    view.on('change:resolution', this.handleTileData_.bind(this));
    map.getCustomLayers().getLayers().push(this);
    this.set('isAddToMap', true);
};

/**
 * 从地图上移除
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
Ez.TileLayer.MultiHotSpot.prototype.onRemove = function (map) {
    if (!this.get('isAddToMap')) return;
    this.map_ = null;

    var view = map.getView();
    view.off('change:resolution', this.handleTileData_.bind(this));

    var customlayers = map.getCustomLayers().getLayers();

    var currentLayer = this;
    customlayers.forEach(function (ele) {
        if (currentLayer === ele) {
            customlayers.remove(ele);
        }
    });
    this.set('isAddToMap', false);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerMultiHotSpot', Ez.TileLayer.MultiHotSpot);
