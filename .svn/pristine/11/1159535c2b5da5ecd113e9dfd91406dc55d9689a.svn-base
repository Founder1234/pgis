/*
|------------------------------------------------------------------------------
|                                Ez.Layer.HeatMap                
|
|@author: qianleyi
|@date: 2016-06-29(重构)
|@descript: 热区图,热力图
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Layer.HeatMap');

goog.require('ol.layer.Heatmap');
goog.require('ol.source.Vector');
goog.require('goog.asserts');

/**
 * 热力图层类
 * @param {Object} configOpts - 热力图相关配置参数
 * @param {Number | undefined} configOpts.radius=8 - 要素的影响半径大小，单位是pixel
 * @param {Number | undefined} configOpts.blur=15 - 要素的影响模糊半径大小，单位是pixel
 * @param {Number | undefined} configOpts.shadow=250 - 要素的阴影半径大小，单位是pixel
 * @param {String | Function} configOpts.weight='weight' - 用于使用的要素权重值属性或者一个返回要素权重值的函数，值域为0~1
 * @param {Number | undefined} configOpts.opacity=1 - 图层透明度
 * @param {EzMBR | undefined} configOpts.extent - 图层的渲染包络框，缺省为没有边界限制
 * @param {String} configOpts.xField - X值的标识
 * @param {String} configOpts.yField - Y值的标识
 * @param {String} configOpts.valueField - value值的标识
 * @param {String[] | undefined} configOpts.gradient - 热力图的颜色梯度数组，默认为['#00f', '#0ff', '#0f0', '#ff0', '#f00']['#00f', '#0ff', '#00FF76', '#0f0', '#62FF00', '#ff0', '#FA7D07', '#f00']
 */
Ez.Layer.HeatMap = function(configOpts) {

    goog.asserts.assert(goog.isDef(configOpts), "config参数不能为空");

    /**
     * 热力图影响半径
     * @type {Number}
     */
    this.radius_ = configOpts.radius || 8;

    /**
     * 热力图模糊影响半径
     * @type {Number}
     */
    this.blur_ = configOpts.blur || 15;

    /**
     * 热力图阴影影响半径
     * @type {Number}
     */
    this.shadow_ = configOpts.shadow || 250;

    /**
     * 权重值
     * @type {String | Function}
     */
    this.weight_ = configOpts.weight;

    /**
     * 透明度
     * @type {Number}
     */
    this.opacity_ = configOpts.opacity || 1;

    /**
     * 包络框
     * @type {Ez.MBR}
     */
    this.extent_ = configOpts.extent || undefined;

    /**
     * 坐标参数X
     * @type {String}
     */
    this.xField_ = configOpts.xField || null;

    /**
     * 坐标参数Y
     * @type {String}
     */
    this.yField_ = configOpts.yField || null;

    /**
     * 值域参数value
     * @type {String}
     */
    this.valueField_ = configOpts.valueField || null;

    /**
     * 颜色梯度
     * @type {String[]}
     */
    this.gradient_ = configOpts.gradient || undefined;

    /**
     * 投影
     * @type {Boolean}
     */
    this.isProj_ = configOpts.isProj_ || false;

    /**
     * 数据源
     * @type {ol.source.Vector}
     */
    this.source_ = new ol.source.Vector();

    /**
     * 地图对象
     * @type {Ez.Map}
     */
    this.map_ = null;

    goog.base(this, {
        source: this.source_,
        radius: this.radius_,
        blur: this.blur_,
        projection: this.isProj_ ? "EPSG:3857" : "EPSG:4326",
        weight: this.weight_,
        shadow: this.shadow_,
        opacity: this.opacity_,
        extent: this.extent_,
        gradient: this.gradient_
    });

    this.set('name', 'heatmap');
    this.set('isAddToMap', false);
};
goog.inherits(Ez.Layer.HeatMap, ol.layer.Heatmap);

/**
 * 增加到地图对象中
 * @param  {EzMap} map - 地图对象
 */
Ez.Layer.HeatMap.prototype.onAdd = function(map) {

    this.map_ = map;

    //获取矢量图层组，中间渲染图层组，然后插入热力图层
    var vectorGroup = map.getVectorLayers();
    var vectorLayerCollections = vectorGroup.getLayers();
    vectorLayerCollections.push(this);
    this.set('isAddToMap', true);
};

/**
 * 从地图对象中移除
 * @param  {EzMap} map - 地图对象
 */
Ez.Layer.HeatMap.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;
    this.map_ = null;

    //获取矢量图层组，中间渲染图层组，然后插入热力图层
    var vectorGroup = map.getVectorLayers();
    var vectorLayerCollections = vectorGroup.getLayers();
    var currentLayer = this;
    vectorLayerCollections.forEach(function(ele) {
        if (currentLayer === ele) {
            vectorLayerCollections.remove(ele);
        }
    });
    this.set('isAddToMap', false);
};

/**
 * 显示热力图
 */
Ez.Layer.HeatMap.prototype.show = function() {
    this.setVisible(true);
};

/**
 * 隐藏热力图,但是保留在内存中，可以通过{@link Ez.Layer.HeatMap#show}方法来显示
 */
Ez.Layer.HeatMap.prototype.hide = function() {
    this.setVisible(false);
};

/**
 * 增加数据然后渲染
 * @param {Object} data - 用于绘制热力图的点数据
 */
Ez.Layer.HeatMap.prototype.addData = function(data) {

    //做判断确定是否值域都正确
    var xField = this.xField_;
    var yField = this.yField_;
    var zField = this.valueField_;

    goog.asserts.assert(!goog.isNull(xField), "xField值必须指定");
    goog.asserts.assert(!goog.isNull(yField), "yField值必须指定");
    goog.asserts.assert(!goog.isNull(zField), "valueField值必须指定");

    //要素数组
    for (var index in data) {
        var point = data[index];
        var pointGeom = new ol.geom.Point([point[xField], point[yField]]);
        var pointFeature = new ol.Feature({
            geometry: pointGeom
        });
        pointFeature.set('weight', point[zField]);
        this.source_.addFeature(pointFeature);
    }
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzLayerHeatMap', Ez.Layer.HeatMap);
