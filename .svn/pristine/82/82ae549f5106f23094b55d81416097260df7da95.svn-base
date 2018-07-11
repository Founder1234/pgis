/*
/-----------------------------------------------------------------------------------  
/			Ez.TileLayer.js
/-----------------------------------------------------------------------------------
*/


goog.provide('Ez.TileLayer');

goog.require('ol.layer.Tile');
goog.require('ol.source.XYZ');

/**
 * 瓦片layer基类，
 * 所有地图服务商的地图服务都可以使用该类通过配置参数的方式获取瓦片地图数据
 *
 * @constructor
 * @extends {ol.layer.Tile} 
 * @param {string} [name] 图层名
 * @param {string} [url] 服务地址
 * @param {Ezx.layer.TileOptions} [options] 瓦片地图配置参数对象
 *
 */
Ez.TileLayer = function(name, url, options) {
    var tileOptions = {};
    var customOpts = null;

    if (!goog.isDef(url)) {
        return;
    }

    this.url_ = url;

    if (goog.isDef(options.projection)) {
        var sourceOptions = {
            url: url,
            projection: options.projection
        };
    } else {
        var sourceOptions = {
            url: url
        };
    }
    tileOptions['source'] = new ol.source.XYZ(sourceOptions);

    for (var i in options) {
        if (options[i] !== 'projection') {
            tileOptions[i] = options[i];
        }
        if (options[i] === 'customOpts') {
            customOpts = options[i];
        }
    }

    this.map_ = null;

    goog.base(this, tileOptions);

    this.set('ezname', name);
    if (customOpts) {
        this.set('customOpts', customOpts);
    }
};
goog.inherits(Ez.TileLayer, ol.layer.Tile);

/**
 * 添加图层到地图
 * 
 * @param {Ez.Map} map 地图对象
 */
Ez.TileLayer.prototype.onAdd = function(map) {
    this.map_ = map;
    map.getTileLayers().getLayers().push(this);
};

/**
 * 从地图中移除当前图层
 * 
 * @param  {Ez.Map} map 地图对象
 */
Ez.TileLayer.prototype.onRemove = function(map) {
    this.map_ = null;

    map.getTileLayers().getLayers().pop();
};

/**
 * 获取该图层下数据源网格的各级分辨率
 * @return {Array<number>} 
 */
Ez.TileLayer.prototype.getResolutions = function() {
    return this.getSource().getTileGrid().getResolutions();
};

Ez.TileLayer.prototype.getUrl = function() {
    var url = this.url_;
    var urlReg = /(.+)\/EzMap?/;
    var ress = url.match(urlReg);
    return ress[1];
};


// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayer', Ez.TileLayer);
