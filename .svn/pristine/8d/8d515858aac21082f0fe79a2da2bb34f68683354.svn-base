/*
|------------------------------------------------------------------------------
|                               Ez.SingleHotSpot.js             
|
|@author: qianleyi
|@date: 2016-05-11
|@descript: 单个热点图层
|------------------------------------------------------------------------------
*/
goog.provide('Ez.SingleHotSpot');

// goog.require('ol.layer.VectorTile');
goog.require('Ez.Coordinate');
goog.require('ol.source.SingleHotSpot');

/**
 * 单个热点图层
 * @param {Object} options
 */
Ez.SingleHotSpot = function(options) {

    var opts = options || {};

    var singleHotSpotSource = new ol.source.SingleHotSpot(opts);


    goog.base(this, {
        source: singleHotSpotSource
    });
};
goog.inherits(Ez.SingleHotSpot, ol.layer.Vector);

/**
 * 增加图层到地图上
 * @param  {Ez.Map} map [description]
 * @return {[type]}     [description]
 */
Ez.SingleHotSpot.prototype.onAdd = function(map) {
    this.map_ = map;

    var view = map.getView();
    view.on('change:resolution', this.deleteSourceData_.bind(this));
    map.getCustomLayers().getLayers().push(this);
};

/**
 * 删除图层
 * @param  {Ez.Map} map [description]
 * @return {[type]}     [description]
 */
Ez.SingleHotSpot.prototype.onRemove = function(map) {
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

Ez.SingleHotSpot.prototype.deleteSourceData_ = function() {
    var source = this.getSource();
    source.clear(true);
    this.map_.render();
};
