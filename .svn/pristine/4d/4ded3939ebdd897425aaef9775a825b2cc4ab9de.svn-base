/*
/-----------------------------------------------------------------------------------  
/			EzMap2010数据格式图层，用于承载EzMap2010格式数据，展示在地图上
/-----------------------------------------------------------------------------------
*/

goog.provide('EzMap2010');

goog.require('ol.source.EzMap2010');
goog.require('ol.layer.Tile');

/**
 * EzMap2010地图图层
 * 
 * @param {string} name        该图层名
 * @param {string} url         XYZ 地图服务模板
 * @param {olx.source.EzMap2010Options} opt_options 图层以及数据源参数
 *
 * @namespace Ez.TileLayer
 */
EzMap2010 = function(name, url, opt_options) {

    /** EzMap2010分辨率 */
    var resolutions = new Array(30);
    for (var z = 9; z >= 0; --z) {
        resolutions[z] = Math.pow(2, (9 - z)) / 256;
    }
    for (var z = 10; z <= 30; ++z) {
        resolutions[z] = (1 / Math.pow(2, (z - 9))) / 256;
    }

    var that = this;
    that.resolutions_ = resolutions;

    this.url_ = url;

    var ezMap2010source = new ol.source.EzMap2010({
        url: url,
        resolutions: resolutions
    });

    //瓦片参数
    var tileOptions = {};
    var customOpts = null;

    for (var i in opt_options) {
        if (opt_options[i] !== 'projection') {
            tileOptions[i] = opt_options[i];
        }
        if (options[i] === 'customOpts') {
            customOpts = options[i];
        }
    }

    tileOptions['source'] = ezMap2010source;

    goog.base(this, tileOptions);

    that.set('ezname', name);
    if (customOpts) {
        this.set('customOpts', customOpts);
    }
};
goog.inherits(EzMap2010, ol.layer.Tile);

/**
 * 添加图层到地图
 * @param {Ez.Map} map 地图对象
 */
EzMap2010.prototype.onAdd = function(map) {
    this.map_ = map;

    map.getTileLayers().getLayers().push(this);
};

/**
 * 从地图中移除当前图层
 * @param  {Ez.Map} map 地图对象
 */
EzMap2010.prototype.onRemove = function(map) {
    this.map_ = null;

    map.getTileLayers().getLayers().pop();
};

/**
 * 获取该图层下数据源网格的各级分辨率
 * @return {Array<number>} 
 */
EzMap2010.prototype.getResolutions = function() {
    return this.getSource().getTileGrid().getResolutions();
};

EzMap2010.prototype.getUrl = function() {
    var url = this.url_;
    var urlReg = /(.+)\/EzMap?/;
    var ress = url.match(urlReg);
    return ress[1];
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzMap2010', EzMap2010);
