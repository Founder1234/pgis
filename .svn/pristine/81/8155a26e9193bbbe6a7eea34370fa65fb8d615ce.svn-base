/*
|------------------------------------------------------------------------------
|                               Ez.MultiHotSpot.js              
|
|@author: qianleyi
|@date: 2016-05-11
|@descript: 多源热点图层集合类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.MultiHotSpot');

goog.require('Ez.SingleHotSpot');
goog.require('ol.layer.Group');

Ez.MultiHotSpot = function(options) {

    goog.base(this, options);

};
goog.inherits(Ez.MultiHotSpot, ol.layer.Group);

/**
 * 增加单个热点图层到集合中
 * @param {EzSingleHotSpotLayer} layer [description]
 */
Ez.MultiHotSpot.prototype.addSingleLayer = function(layer) {
    this.getLayers().push(layer);
};

/**
 * 删除单个热点图层
 * @param  {EzSingleHotSpotLayer} layer
 */
Ez.MultiHotSpot.prototype.deleteSingleLayer = function(layer) {
    var layers = this.getLayers();

    layers.forEach(function(ele) {
        if (layer === ele) {
            layers.remove(ele);
            return;
        }
    });
};

Ez.MultiHotSpot.prototype.deleteSourceData_ = function() {
    var layers = this.getLayers();
    layers.forEach(function(ele) {
        ele.getSource().clear();
    });
};

/**
 * 增加到地图
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
Ez.MultiHotSpot.prototype.onAdd = function(map) {

    this.map_ = map;

    var view = map.getView();
    view.on('change:resolution', this.deleteSourceData_.bind(this));
    map.getCustomLayers().getLayers().push(this);
};

/**
 * 从地图上移除
 * @param  {[type]} map [description]
 * @return {[type]}     [description]
 */
Ez.MultiHotSpot.prototype.onRemove = function(map) {
    this.map_ = null;

    var view = map.getView();
    view.off('change:resolution', this.deleteSourceData_.bind(this));

    var customlayers = map.getCustomLayers().getLayers();

    var currentLayer = this;
    customlayers.forEach(function(ele) {
        if (currentLayer === ele) {
            customlayers.remove(ele);
        }
    });
};
