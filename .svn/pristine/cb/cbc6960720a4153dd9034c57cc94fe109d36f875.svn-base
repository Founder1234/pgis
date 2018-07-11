/*
|------------------------------------------------------------------------------
|                                   Ez.Global.js                
|
|@author: qianleyi
|@date: 2015-11-27
|@descript: 当用户配置了EzMapAPI.js时,调用该类进行初始化配置,并做相应操作
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Global');

goog.require('ol.events.EventTarget');

/**
 * 用作初始化相关工作
 * @param {Object} EzMapAPI.js 配置参数集
 * @param {Ez.Map} map [description]
 * @constructor
 * @extends {ol.events.EventTarget}
 */
Ez.Global = function(options, map) {
    var optionsObject = goog.isDef(options) ? options : {};
    goog.base(this);

    /** @type {Ez.Map} */
    this.map_ = map;
    this.opts_ = optionsObject;
    /** 图层组 */
    var layersStr = optionsObject.MapSrcURL;
    /** @type {Array} 自动生成图层组控件的传入参数 */
    this.layersInfoArray_ = [];
    this.layers_ = [];
    for (var i = layersStr.length - 1; i >= 0; i--) {
        var layerid = layersStr[i][0];
        var layerurl = layersStr[i][1];
        var argument = layersStr[i][2];

        var opts = {};
        for (var index in argument) {
            if (index === 'crs') {
                opts.projection = this.crs2Projection(argument[index]);
            } else {
                opts[index] = argument[index];
            }
        }

        if (!opts.key) {
            opts.key = optionsObject.AuthorKey ? optionsObject.AuthorKey : '';
        }

        var layer;
        //对于argument.type的类型进行分类处理
        if (opts.type === 'EzMap2010') {
            layer = new Ez.TileLayer.EzMap2010(layerid, layerurl, opts);
        } else if (opts.type === 'EzMap2010Local') {
            layer = new Ez.TileLayer.EzMap2010Proj(layerid, layerurl, opts);
        } else if (opts.type === 'wmts') {
            layer = new Ez.TileLayer.WMTS(layerid, layerurl, opts);
        } else if (opts.type === 'group') {
            var baseLayer, overlayLayer, overlayOpts;
            overlayOpts = Object.assign({}, opts.subLayer[1], { projection: opts.projection }, { key: opts.key });
            if (opts.subType === 'EzMap2010') {
                baseLayer = new Ez.TileLayer.EzMap2010(layerid, layerurl, opts);
                overlayLayer = new Ez.TileLayer.EzMap2010(layerid, opts.subLayer[0], overlayOpts);
            } else if (opts.subType === 'EzMap2010Local') {
                baseLayer = new Ez.TileLayer.EzMap2010Proj(layerid, layerurl, opts);
                overlayLayer = new Ez.TileLayer.EzMap2010Proj(layerid, opts.subLayer[0], overlayOpts);
            } else if (opts.subType === 'wmts') {
                baseLayer = new Ez.TileLayer.WMTS(layerid, layerurl, opts);
                overlayLayer = new Ez.TileLayer.WMTS(layerid, opts.subLayer[0], overlayOpts);
            } else {
                baseLayer = new Ez.TileLayer.TDT(layerid, layerurl, opts);
                overlayLayer = new Ez.TileLayer.TDT(layerid, opts.subLayer[0], overlayOpts);
            }
            layer = new Ez.Layer.Group({
                layers: [baseLayer, overlayLayer]
            });
            layer.set('ezname', layerid);
            layer.set('imageSRC', opts.imageSRC);
        } else if (opts.type ==='gd'){
            layer = new Ez.TileLayer.GD(layerid, layerurl, opts);
        }else {
            layer = new Ez.TileLayer.TDT(layerid, layerurl, opts);
        }

        if (i === 0) { map.addLayer(layer); }

        this.layers_.push(layer);

        /** 图层组控件 */
        var layerInfo = {};
        layerInfo.title = layer.get('ezname');
        layerInfo.layer = layer;
        layerInfo.imageSRC = layer.get('imageSRC');
        this.layersInfoArray_.push(layerInfo);
    }
};
goog.inherits(Ez.Global, ol.events.EventTarget);

/**
 * 初始化相关参数
 * @return {[type]} [description]
 */
Ez.Global.prototype.initialize = function() {};

/**
 * 获取地图全局参数对象
 * @return {Object} [description]
 */
Ez.Global.prototype.getGlobalOptions = function() {
    return this.opts_;
};

/**
 * crs转标准投影参考
 * @param  {String} crs [description]
 * @return {String}     [description]
 */
Ez.Global.prototype.crs2Projection = function(crs) {
    var proStr = goog.isDef(crs) ? crs : "4326";
    return "EPSG:" + proStr;
};

/**
 * 获取配置的图层对象
 * @return {Number[]}
 */
Ez.Global.prototype.getLayers = function() {
    return this.layers_;
};

/**
 *
 * 获取图层信息数组，按照用户EzMapAPI中的配置顺序进行组织
 *
 * 格式为：
 * 1. 图层名
 * 2. 图层对象
 * 3. 图层显示缩略图
 *
 * @return {Object[]}
 */
Ez.Global.prototype.getLayersInfo = function() {
    return this.layersInfoArray_;
};
