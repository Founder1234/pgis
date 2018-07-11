/*
|------------------------------------------------------------------------------
|                               Ez.Tilelayer.Base               
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: Base为瓦片图层基类，任何瓦片图层都可以通过Base来配置生成
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.Base');

goog.require('ol.layer.Tile');

/**
 * 瓦片图层基类，通过配置参数可以展示所有类型的瓦片地图（有相应的地图源支持）
 * @constructor
 * @extends {ol.layer.Tile}
 * @param {String} name        瓦片的图层名，唯一
 * @param {Object} opt_options 瓦片的配置参数
 */
Ez.TileLayer.Base = function(name, opt_options) {

    var opts = opt_options ? opt_options : {};

    /**
     * 瓦片图层参数设置
     */
    var tileOptions = {};
    /** @type {Object} 用户通过EzMapAPI中的图层参数设置的属性 */
    var customOpts = opts.customOpts ? opts.customOpts : null;

    for (var i in opts) {
        if (opts[i] !== 'customOpts') {
            tileOptions[i] = opts[i];
        }
    }

    goog.base(this, tileOptions);

    /**
     * 图层的appkey属性
     * @type {String}
     */
    this.key_ = opts.key;

    this.set('ezname', name);
    this.set('isAddToMap', false);
    if (customOpts) {
        this.set('customOpts', customOpts);
    }
};
goog.inherits(Ez.TileLayer.Base, ol.layer.Tile);

/**
 * 添加图层到地图
 * @param {Ez.Map} map 地图对象
 */
Ez.TileLayer.Base.prototype.onAdd = function(map) {
    this.map_ = map;
    map.getTileLayers().getLayers().push(this);
    this.set('isAddToMap', true);
};

/**
 * 从地图中移除当前图层
 * @param  {Ez.Map} map 地图对象
 */
Ez.TileLayer.Base.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;
    this.map_ = null;
    map.getTileLayers().getLayers().remove(this);
    this.set('isAddToMap', false);
};

/**
 * 获取该图层下数据源网格的各级分辨率
 * @return {Array<number>} 
 */
Ez.TileLayer.Base.prototype.getResolutions = function() {
    return this.getSource().getTileGrid().getResolutions();
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerBase', Ez.TileLayer.Base);
