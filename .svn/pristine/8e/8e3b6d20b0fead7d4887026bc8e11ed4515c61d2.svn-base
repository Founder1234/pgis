/*
|------------------------------------------------------------------------------
|                               EzMap2010Local              
|
|@author: qianleyi
|@date: 2016-04-15
|@descript: 公司2010格式地图用于处理地方坐标系瓦片
|------------------------------------------------------------------------------
*/
goog.provide('EzMap2010Local');

goog.require('ol.source.EzMap2010');
goog.require('ol.layer.Tile');

/**
 * EzMap2010Local地图图层
 * 
 * @param {string} name        该图层名
 * @param {string} url         XYZ 地图服务模板
 * @param {olx.source.EzMap2010Options} opt_options 图层以及数据源参数
 *
 * @namespace Ez.TileLayer
 */
EzMap2010Local = function(name, url, opt_options) {

    /** EzMap2010分辨率 */
    var resolutions = new Array(30);
    for (var z = 9; z >= 0; --z) {
        resolutions[z] = Math.pow(2, (9 - z)) / 256 * 114699;
    }
    for (var z = 10; z <= 30; ++z) {
        resolutions[z] = (1 / Math.pow(2, (z - 9))) / 256 * 114699;
    }

    var that = this;
    that.resolutions_ = resolutions;

    this.url_ = url;

    var ezMap2010source = new ol.source.EzMap2010({
        url: url,
        resolutions: resolutions,
        projection: 'EPSG:3857'
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
goog.inherits(EzMap2010Local, ol.layer.Tile);

/**
 * 添加图层到地图
 * @param {Ez.Map} map 地图对象
 */
EzMap2010Local.prototype.onAdd = function(map) {
    this.map_ = map;

    map.getTileLayers().getLayers().push(this);
};

/**
 * 从地图中移除当前图层
 * @param  {Ez.Map} map 地图对象
 */
EzMap2010Local.prototype.onRemove = function(map) {
    this.map_ = null;

    map.getTileLayers().getLayers().pop();
};

/**
 * 获取该图层下数据源网格的各级分辨率
 * @return {Array<number>} 
 */
EzMap2010Local.prototype.getResolutions = function() {
    return this.getSource().getTileGrid().getResolutions();
};

EzMap2010Local.prototype.getUrl = function() {
    var url = this.url_;
    var urlReg = /(.+)\/EzMap?/;
    var ress = url.match(urlReg);
    return ress[1];
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzMap2010Local', EzMap2010Local);
