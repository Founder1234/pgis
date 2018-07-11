/*
|------------------------------------------------------------------------------
|                ol.interaction.editCircle        
|
|@author: qianleyi
|@date: 2016-06-08
|@descript: 实现交互下的圆编辑功能
|------------------------------------------------------------------------------
*/
goog.provide('ol.interaction.EditCircle');

goog.require('ol.interaction.Pointer');

/**
 * 圆要素编辑类
 * @param  {Ez.g.Circle} feature 圆要素
 * @param {Function}
 * @param {Function}
 * @constructor
 * @extends {ol.interaction.Pointer}
 */
ol.interaction.EditCircle = function(feature, cb, cb2) {

    if (!feature) {
        new Error("圆编辑必须指定featue对象");
    }

    goog.base(this, {
        handleDownEvent: ol.interaction.EditCircle.handleDownEvent_,
        handleEvent: ol.interaction.EditCircle.handleEvent,
        handleUpEvent: ol.interaction.EditCircle.handleUpEvent_
    });

    this.target_ = feature;

    /**
     * 草稿绘制的画布
     * @type {ol.layer.Vector}
     */
    this.overlay_ = new ol.layer.Vector({
        source: new ol.source.Vector({
            useSpatialIndex: false
        }),
        style: feature.getStyle()
    });

    /**
     * 编辑圆的中心位置
     * @type {number[]}
     */
    this.center_ = this.target_.getCenter().getCoordinate();

    /**
     * 编辑圆半径
     * @type {[type]}
     */
    this.radius_ = this.target_.getGeometry().getRadius();

    this.cb_ = cb ? cb : function() {};
    this.cb2_ = cb2 ? cb2 : function() {};

    /**
     * 初始化控制按钮，用于控制编辑
     * @type {HTMLElement}
     */
    this.controlBtn_ = new ol.Overlay({
        element: this.initElement()
    });

    /**
     * 编辑状态
     * @type {Boolean}
     */
    this.editing = false;

    /**
     * 鼠标是否已经被按下
     * @type {Boolean}
     */
    this.mousedown_ = false;

    this.upfn_ = ol.interaction.EditCircle.handleUpEvent_.bind(this);

    this.mapport;

};
goog.inherits(ol.interaction.EditCircle, ol.interaction.Pointer);

/**
 * 初始化编辑圆环境
 */
ol.interaction.EditCircle.prototype.initSketch = function() {
    var map = this.getMap();
    map.removeOverlay(this.target_);

    var geom = this.target_.getGeometry();
    var feature = new ol.Feature({
        geometry: geom
    });
    feature.setId('skectchId');
    this.overlay_.getSource().addFeature(feature);

    this.controlBtn_.setPosition([this.center_[0] + this.radius_, this.center_[1]]);
};

/**
 * @inheritDoc
 */
ol.interaction.EditCircle.prototype.setMap = function(map) {
    goog.base(this, 'setMap', map);
    this.updateState_();
};


ol.interaction.EditCircle.prototype.updateState_ = function() {
    var map = this.getMap();
    if (goog.isNull(map)) {
        return;
    }
    var vectorLayers = map.getVectorLayers();
    vectorLayers.getLayers().push(this.overlay_);
    map.addOverlay(this.controlBtn_, true);
    this.initSketch();
    this.mapport = this.getMap().getViewport();
    this.mapport.addEventListener('mouseup', this.upfn_);
};

/**
 * 设置按钮的DOM
 * return {HTMLElement}
 */
ol.interaction.EditCircle.prototype.initElement = function() {
    var ele = document.createElement('div');
    ele.className = "ez-editCircle-btn";
    ele.id = "ez_editCicle_btn";
    ele.addEventListener('mousedown', this.handleDownEvent_.bind(this));
    //ele.addEventListener('mouseup', this.handleUpEvent_.bind(this));
    //ele.addEventListener('mouseout', this.handleUpEvent_.bind(this));
    return ele;
};

/**
 * 处理 {@link ol.MapBrowserEvent}地图浏览器事件，
 * 也许事实上可能处理或者完成了绘制
 * @param  {ol.MapBrowserEvent} mapBrowserEvent
 * @return {boolean} 'false' 用来停止事件传播
 * @this {ol.interaction.Draw2}
 * @api
 */
ol.interaction.EditCircle.handleEvent = function(mapBrowserEvent) {
    if (mapBrowserEvent.type === ol.MapBrowserEvent.EventType.POINTERMOVE && this.editing) {
        var map = this.getMap();
        var source = this.overlay_.getSource();
        var currentTarget = source.getFeatureById('skectchId');
        var geom = currentTarget.getGeometry();
        this.handleDragGeom_(geom, mapBrowserEvent);

        var fc = currentTarget.getGeometry().getCenter();
        var coords = new Ez.Coordinate(fc[0], fc[1]);
        var newCircle = new Ez.g.Circle(coords, currentTarget.getGeometry().getRadius(), { isMeter: true });

        this.cb2_(newCircle);
    }
    return false;
};

ol.interaction.EditCircle.prototype.handleDragGeom_ = function(geom, mapBrowserEvent) {
    var coords = mapBrowserEvent.coordinate;
    var center = this.center_;
    this.controlBtn_.setPosition([coords[0], center[1]]);
    var radius = Math.abs((coords[0] - center[0]));
    geom.setRadius(radius);
};


/**
 * @param {ol.MapBrowserPointerEvent} event Event.
 * @return {boolean} <Start></Start> drag sequence?
 * @this {ol.interaction.Draw2}
 * @private
 */
ol.interaction.EditCircle.handleDownEvent_ = function(mapBrowserEvent) {
    this.editing = true;
    this.mousedown_ = true;
};


/**
 * @param {ol.MapBrowserPointerEvent} event Event.
 * @return {boolean} Stop drag sequence?
 * @this {ol.interaction.Draw}
 * @private
 */
ol.interaction.EditCircle.handleUpEvent_ = function(event) {
    this.editing = false;

    var source = this.overlay_.getSource();
    var currentTarget = source.getFeatureById('skectchId');

    var fc = currentTarget.getGeometry().getCenter();
    var coords = new Ez.Coordinate(fc[0], fc[1]);
    var newCircle = new Ez.g.Circle(coords, currentTarget.getGeometry().getRadius(), { isMeter: true });

    this.cb_(newCircle);
};

ol.interaction.EditCircle.prototype.disposeAll = function(callback) {
    var map = this.getMap();
    var source = this.overlay_.getSource();
    var feature = source.getFeatureById('skectchId').getGeometry();
    var mapPort = map.getViewport();

    this.mapport.removeEventListener('mouseup', this.upfn_);

    var fc = feature.getCenter();
    var coords = new Ez.Coordinate(fc[0], fc[1]);
    var newCircle = new Ez.g.Circle(coords, feature.getRadius(), { isMeter: true });

    map.removeOverlay(this.controlBtn_, true);
    var layers = map.getVectorLayers().getLayers();
    var sketchLayer = this.overlay_;
    layers.forEach(function(ele) {
        if (sketchLayer === ele) {
            layers.remove(ele);
            return;
        }
    });

    //更新旧的要素
    // -----------------------------------------
    this.target_.getGeometry().setRadius(newCircle.getGeometry().getRadius());
    map.addOverlay(this.target_);
    // -----------------------------------------
    callback(this.target_);
};
