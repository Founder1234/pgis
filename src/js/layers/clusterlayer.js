/*
|------------------------------------------------------------------------------
|                                Ez.Layer.Cluster                
|
|@author: qianleyi
|@date: 2016-07-19
|@descript: 聚类展示要素图层
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Layer.Cluster');

/**
 * 图层聚类图层类
 * @param {Object} options 聚类图层相关配置参数
 * @param {String} options.projection 图层地图投影参数
 * @param {Number} options.opacity 图层显示透明度，0~1.
 * @param {Number} options.minZoom 图层显示最小级别
 * @param {Number} options.maxZoom 图层显示最小级别
 * @param {Function} options.styleFunction 要显示的聚类样式
 * @param {Object} options.cluster 聚类要素配置参数
 * @param {Number} options.cluster.distance 要素间的最小像素距离，默认20
 * @param {Function} options.cluster.geometryFunction 函数返回几何对象用于显示聚类要素点
 * @constructor
 * @extends {ol.Layer.Vector}
 */
Ez.Layer.Cluster = function(options) {

    var opts = options ? options : {};

    /**
     * 图层投影
     * @type {String}
     */
    var projection = opts.projection ? opts.projection : 'EPSG:4326';

    /**
     * 图层透明度
     * @type {Number}
     */
    var opacity = opts.opacity ? opts.opacity : 1;

    /**
     * 图层最小显示分辨率
     * @type {Number}
     */
    var minResolution = Ez.Layer.Cluster.getResolution(opts.maxZoom ? opts.maxZoom : 18);

    /**
     * 图层最大显示分辨率
     * @type {Number}
     */
    var maxResolution = Ez.Layer.Cluster.getResolution(opts.minZoom ? opts.minZoom : 0);

    /**
     * 聚类样式类型
     * @type {String}
     */
    var type = opts.type ? opts.type : 'default';

    /**
     * 样式类型枚举
     * @type {Object}
     * @enum {String}
     */
    var styleFunctions = {
        'default': Ez.Layer.Cluster.styleFunctionDefault.bind(this),
        'scale': Ez.Layer.Cluster.styleFunctionScale.bind(this),
        'nomarker': Ez.Layer.Cluster.styleFunctionNoMarker.bind(this)
    };

    /**
     * 样式函数
     * @type {Function}
     */
    var styleFunction = opts.styleFunction ? opts.styleFunction : styleFunctions[type];

    var clusterOpts = opts.cluster ? opts.cluster : {};

    var originalSource = new ol.source.Vector();

    var source = new ol.source.Cluster2({
        geometryFunction: clusterOpts.geometryFunction,
        distance: clusterOpts.distance ? clusterOpts.distance : 40,
        source: originalSource
    });

    goog.base(this, {
        projection: projection,
        opacity: opacity,
        minResolution: minResolution,
        maxResolution: maxResolution,
        source: source,
        style: styleFunction
    });

    this.styleCache = {};

    this.currentResolution_;

    this.maxFeatureCount_;
};
goog.inherits(Ez.Layer.Cluster, ol.layer.Vector);

/**
 * 样式函数Default
 * @param  {Ez.Marker} feature
 * @return {ol.style.Style} 
 */
Ez.Layer.Cluster.styleFunctionDefault = function(feature) {
    var size = feature.get('features').length;
    var style = this.styleCache[size];
    if (!style) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 15,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#3399CC'
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        });
        this.styleCache[size] = style;
    }
    if (size > 1) {
        return style;
    } else {
        var originalStyle = feature.get('features')[0].getStyle();
        return originalStyle;
    }
};

/**
 * 样式函数Default
 * @param  {Ez.Marker} feature
 * @return {ol.style.Style} 
 */
Ez.Layer.Cluster.styleFunctionNoMarker = function(feature) {
    var size = feature.get('features').length;
    var style = this.styleCache[size];
    if (!style) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 15,
                stroke: new ol.style.Stroke({
                    color: '#fff'
                }),
                fill: new ol.style.Fill({
                    color: '#F15D2D'
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: new ol.style.Fill({
                    color: '#fff'
                })
            })
        });
        this.styleCache[size] = style;
    }
    return style;
};

/**
 * 样式函数Scale
 * @param  {Ez.Marker} feature
 * @return {ol.style.Style}
 */
Ez.Layer.Cluster.styleFunctionScale = function(feature, resolution) {

    var textFill = new ol.style.Fill({
        color: '#fff'
    });
    var textStroke = new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.6)',
        width: 3
    });

    if (resolution != this.currentResolution_) {
        this.calculateClusterInfo_(resolution);
        this.currentResolution_ = resolution;
    }
    var style;
    var size = feature.get('features').length;
    if (size > 1) {
        style = new ol.style.Style({
            image: new ol.style.Circle({
                radius: feature.get('radius'),
                fill: new ol.style.Fill({
                    color: [255, 153, 0, Math.min(0.8, 0.4 + (size / this.maxFeatureCount_))]
                })
            }),
            text: new ol.style.Text({
                text: size.toString(),
                fill: textFill,
                stroke: textStroke
            })
        });
    } else {
        style = feature.get('features')[0].getStyle();
    }
    return style;
}

/**
 * 计算聚类信息
 * @param  {Number} resolution
 */
Ez.Layer.Cluster.prototype.calculateClusterInfo_ = function(resolution) {
    this.maxFeatureCount_ = 0;
    var features = this.getSource().getFeatures();
    var feature, radius;
    for (var i = features.length - 1; i >= 0; --i) {
        feature = features[i];
        var originalFeatures = feature.get('features');
        var extent = ol.extent.createEmpty();
        var j, jj;
        for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
            ol.extent.extend(extent, originalFeatures[j].getGeometry().getExtent());
        }
        this.maxFeatureCount_ = Math.max(this.maxFeatureCount_, jj);
        radius = 0.25 * (ol.extent.getWidth(extent) + ol.extent.getHeight(extent)) /
            resolution;
        feature.set('radius', radius);
    }
};

/**
 * 计算网格下的分辨率
 * @param  {Number} z
 * @return {Number}
 */
Ez.Layer.Cluster.getResolution = function(z) {
    var tilegrid = ol.tilegrid.createXYZ({
        extent: ol.tilegrid.extentFromProjection('EPSG:4326'),
        tileSize: 256
    });
    return tilegrid.getResolution(z);
};

/**
 * 增加图层到地图
 * @param  {Ez.Map} map
 */
Ez.Layer.Cluster.prototype.onAdd = function(map) {
    this.map_ = map;
    map.getTileLayerOverlayLayers().getLayers().push(this);
};

/**
 * 移除图层从地图
 * @param  {Ez.Map} map
 */
Ez.Layer.Cluster.prototype.onRemove = function(map) {
    this.map_ = null;
    map.getTileLayerOverlayLayers().getLayers().remove(this);
};

/**
 * 增加数据集
 * @param {Ez.Overlay} features
 */
Ez.Layer.Cluster.prototype.addData = function(features) {
    this.getSource().getSource().addFeatures(features);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzLayerCluster', Ez.Layer.Cluster);
