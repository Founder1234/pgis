/*
|------------------------------------------------------------------------------
|                                Ez.Layer.Group                
|
|@author: qianleyi
|@date: 2016-06-29
|@descript: 合并图层，一般用于合并操作（注记和底图）
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Layer.Group');

goog.require('ol.layer.Group');

/**
 * 图层组
 * @param {Object} options 配置参数
 * @param {Number} [options.opacity=1] 图层组透明度
 * @param {Ez.TileLayer.Base[]} [options.layers=[]] 图层元素
 * @constructor
 * @extends {ol.layer.Group}
 */
Ez.Layer.Group = function(options) {
    goog.base(this, options);
    this.set('isAddToMap', false);
};
goog.inherits(Ez.Layer.Group, ol.layer.Group);

/**
 * 增加到地图对象中
 * @param  {Ez.Map} map - 地图对象
 */
Ez.Layer.Group.prototype.onAdd = function(map) {
    this.map_ = map;

    var tileLayerGroup = map.getTileLayers().getLayers();
    tileLayerGroup.push(this);
    this.set('isAddToMap', true);
};

/**
 * 从地图对象中移除
 * @param  {Ez.Map} map - 地图对象
 */
Ez.Layer.Group.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;
    this.map_ = null;

    var tileLayerGroup = map.getTileLayers().getLayers();
    tileLayerGroup.remove(this);
    this.set('isAddToMap', false);
};

/**
 * 增加图层到图层组中，并显示在地图上
 * @param  {Ez.TileLayer.Base} layer
 */
Ez.Layer.Group.prototype.push = function(layer) {
    var layers = this.getLayers();
    layers.push(layer);
};

/**
 * 删除图层组中的具体某个图层
 * @param  {Ez.TileLayer.Base} layer
 */
Ez.Layer.Group.prototype.remove = function(layer) {
    var layers = this.getLayers();
    layers.remove(layer);
};

/**
 * 删除图层组中所有图层
 * @return {} [description]
 */
Ez.Layer.Group.prototype.clear = function() {
    var layers = this.getLayers();
    layers.clear();
};

/**
 * 显示图层组
 */
Ez.Layer.Group.prototype.show = function() {
    this.setVisible(true);
};

/**
 * 隐藏图层组
 */
Ez.Layer.Group.prototype.hide = function() {
    this.setVisible(false);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzLayerGroup', Ez.Layer.Group);
