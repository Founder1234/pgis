/*
/-----------------------------------------------------------------------------------  
/           Ez.Overlayer.js
/-----------------------------------------------------------------------------------
*/
goog.provide('Ez.Overlay');

goog.require('ol.Feature');

/**
 * [Overlay description]
 * @param {ol.geom.Geometry|Object.<string, *>=} [options]
 * @extends {ol.Feature}
 * @constructor
 */
Ez.Overlay = function(options) {
    goog.base(this, options);

    this.layer_ = null;
    this.set('isAddToMap', false);
};
goog.inherits(Ez.Overlay, ol.Feature);

/**
 * [onAdd description]
 * @param {Ez.Map} map
 */
Ez.Overlay.prototype.onAdd = function(map) {
    this.map_ = map;

    //default vector 图层
    var vectorLayers = map.getVectorLayers();
    var vectorEle = this;
    vectorLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            vectorLayer.getSource().addFeature(vectorEle);
            vectorEle.layer_ = vectorLayer;
        }
    });

    this.set('isAddToMap', true);
};

/**
 * [onRemove description]
 * @param  {Ez.Map} map 
 */
Ez.Overlay.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;
    if (this.popup_) {
        this.map_.removeOverlay(this.popup_);
        this.popup_ = null;
    }

    this.map_ = null;

    //default vector 图层
    var vectorLayers = map.getVectorLayers();
    var vectorEle = this;
    vectorLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            vectorLayer.getSource().removeFeature(vectorEle);
        }
    });
    this.set('isAddToMap', false);
};

/**
 * 获取要素的外包络框
 * @return {[type]} [description]
 */
Ez.Overlay.prototype.getMBR = function() {
    var extent = this.getGeometry().getExtent();
    return new Ez.MBR(extent[0], extent[1], extent[2], extent[3]);
};

Ez.Overlay.readGeoJSON = function(geojson) {
    var geoutil = new ol.format.GeoJSON();
    var coordinate = geoutil.readFeature(geojson);
    return coordinate;
};

/**
 * 将要素转化为GeoJSON格式
 * @return {String}
 */
Ez.Overlay.prototype.toGeoJSON = function() {
    var geoutil = new ol.format.GeoJSON();
    return JSON.parse(geoutil.writeFeature(this));
};

/**
 * FillStyle Getter
 * @return {ol.style.Fill}
 * @private
 */
Ez.Overlay.prototype.getFillStyle_ = function() {
    return this.getStyle().getFill();
};

/**
 * StrokeStyle Getter
 * @return {ol.style.Stroke}
 * @private
 */
Ez.Overlay.prototype.getStrokeStyle_ = function() {
    return this.getStyle().getStroke();
};

/**
 * Fill Color Getter
 * @return {string}
 */
Ez.Overlay.prototype.getFillColor = function() {
    var fillstyle = this.getFillStyle_();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    return ol.color.asString(colorarray);
};

/**
 * Fill Opacity Getter
 * @return {number}
 */
Ez.Overlay.prototype.getFillOpacity = function() {
    var fillstyle = this.getFillStyle_();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    return parseFloat(colorarray[3]);
};

/**
 * Fill Color Setter
 * @param {string} colorString
 */
Ez.Overlay.prototype.setFillColor = function(colorString) {
    var style = this.getStyle();
    var fillstyle = this.getFillStyle_();
    var currentOpacity = ol.color.asArray(fillstyle.getColor())[3];
    var colorarray = ol.color.asArray(colorString);
    colorarray[3] = currentOpacity;
    fillstyle.setColor(colorarray);
    this.setStyle(style);
};

/**
 * Fill Opacity Setter
 * @param {number} opacity 0 <= opacity <= 1
 */
Ez.Overlay.prototype.setFillOpacity = function(opacity) {
    goog.asserts.assert((opacity >= 0 && opacity <= 1), '设置的透明度必须在[0,1]范围内');
    var style = this.getStyle();
    var fillstyle = this.getFillStyle_();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    colorarray[3] = opacity;
    fillstyle.setColor(colorarray);
    this.setStyle(style);
};

/**
 * Stroke Color Getter
 * @return {string}
 */
Ez.Overlay.prototype.getStrokeColor = function() {
    var strokestyle = this.getStrokeStyle_();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    return ol.color.asString(colorarray);
};

/**
 * Stroke Width Getter
 * @return {number}
 */
Ez.Overlay.prototype.getStrokeWidth = function() {
    var strokestyle = this.getStrokeStyle_();
    return strokestyle.getWidth();
};

/**
 * Stroke Opacity Getter
 * @return {number}
 */
Ez.Overlay.prototype.getStrokeOpacity = function() {
    var strokestyle = this.getStrokeStyle_();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    return parseFloat(colorarray[3]);
};

/**
 * Stroke Color Setter
 * @param {string} colorString
 */
Ez.Overlay.prototype.setStrokeColor = function(colorString) {
    var style = this.getStyle();
    var strokestyle = this.getStrokeStyle_();
    var currentOpacity = ol.color.asArray(strokestyle.getColor())[3];
    var colorarray = ol.color.asArray(colorString);
    colorarray[3] = currentOpacity;
    strokestyle.setColor(colorarray);
    this.setStyle(style);
};

/**
 * Stroke Width Setter
 * @param {number} number
 */
Ez.Overlay.prototype.setStrokeWidth = function(number) {
    var style = this.getStyle();
    var strokestyle = this.getStrokeStyle_();
    strokestyle.setWidth(number);
    this.setStyle(style);
};

/**
 * Stroke Opacity Setter
 * @param {number} opacity 0 <= opacity <= 1
 */
Ez.Overlay.prototype.setStrokeOpacity = function(opacity) {
    goog.asserts.assert((opacity >= 0 && opacity <= 1), '设置的透明度必须在[0,1]范围内');
    var style = this.getStyle();
    var strokestyle = this.getStrokeStyle_();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    colorarray[3] = opacity;
    strokestyle.setColor(colorarray);
    this.setStyle(style);
};

/**
 * 显示当前要素
 */
Ez.Overlay.prototype.show = function() {
    if (this.get('isAddToMap')) return;
    //default vector 图层
    var layers = this.map_.getVectorLayers();
    var element = this;
    layers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            vectorLayer.getSource().addFeature(element);
        }
    });
    this.set('isAddToMap', true);
};

/**
 * 隐藏当前要素
 */
Ez.Overlay.prototype.hide = function() {
    if (!this.get('isAddToMap')) return;
    //default vector 图层
    var layers = this.map_.getVectorLayers();
    var element = this;
    layers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            vectorLayer.getSource().removeFeature(element);
        }
    });
    this.set('isAddToMap', false);
};

/**
 * 增加标题对象到overlay对象中
 * @param {Ez.Overlay} title
 */
Ez.Overlay.prototype.addTitle = function(title) {

    if (!title) {
        goog.assert(false, "EzTitle对象不能为空");
    }

    this.title_ = title;

    this.isTitleOnMap = false;
    this.isTitleInited = false;
};

/**
 * 显示标题
 */
Ez.Overlay.prototype.showTitle = function() {
    if (!this.map_ || !this.title_) {
        return;
    }

    var map = this.map_;

    if (!this.isTitleInited) {
        this.handleTitleInit_();
    }

    this.title_.show();
    this.isTitleOnMap = true;
};

/**
 * 根据要素的类型确定标题的显示位置
 * @return {[type]} [description]
 */
Ez.Overlay.prototype.handleTitleInit_ = function() {
    var type = this.getGeometry().getType();
    var coords;

    if (type === ol.geom.GeometryType.CIRCLE) {
        coords = this.getCenter();
    } else if (type === ol.geom.GeometryType.POINT) {
        coords = this.getCenter();
    } else if (type === ol.geom.GeometryType.LINE_STRING) {
        coords = this.getCenter();
    } else if (type === ol.geom.GeometryType.POLYGON) {
        coords = this.getCenter();
    } else {
        coords = this.getPoint();
    }

    this.title_.setPosition(coords);
    this.map_.addOverlay(this.title_);
    this.isTitleInited = true;
};

/**
 * 隐藏标题
 */
Ez.Overlay.prototype.hideTitle = function() {
    this.title_.hide();
    this.isTitleOnMap = false;
    this.isTitleInited = false;
    this.map_.removeOverlay(this.title_);
};

/**
 * 在Overlay对象中打开一个InfoWindow
 * @param  {Ez.Coordinate | Array.<number,number>} coordinate
 * @param  {string} strHTML
 */
Ez.Overlay.prototype.openInfoWindow = function(strHTML, coordinate, options) {
    var coords;
    if (coordinate instanceof Ez.Coordinate) {
        coords = coordinate.getCoordinate();
    } else if (goog.isArray(coordinate)) {
        coords = coordinate;
    } else {
        goog.asserts.assert(false, '请传入坐标数组或者EzCoord对象');
    }

    if (this.popup_) {
        this.map_.removeOverlay(this.popup_);
        this.popup_ = null;
    }
    this.popup_ = new Ez.Popup(options);
    this.map_.addOverlay(this.popup_);
    this.popup_.show(strHTML, coords);
};

/**
 * 关闭InfoWindow
 * @return {[type]} [description]
 */
Ez.Overlay.prototype.closeInfoWindow = function() {
    if (!this.popup_) {
        return;
    }

    this.map_.removeOverlay(this.popup_);
    this.popup_ = null;
};

/**
 * 获取要素的外包络框
 * @return {Ez.MBR}
 */

Ez.Overlay.prototype.getBounds = function() {
    var geom = this.getGeometry().getExtent();
    return new Ez.MBR(geom[0], geom[1], geom[2], geom[3]);
};

/**
 * 要素flash
 * @param  {Object} options 参数配置
 */
Ez.Overlay.prototype.flash = function(options) {
    var opts = options ? options : {};

    //定义闪烁的持续时间
    var duration = opts['duration'] ? opts['duration'] : 3000;
    var times = opts['times'] ? opts['times'] : 3;

    //保存要素样式，隐藏要素
    this.hide();
    var oldFill = this.getFillOpacity();
    var oldStroke = this.getStrokeOpacity();

    if (!this.map_) return;

    var start = new Date().getTime();
    var firstTime = new Date(start);
    var listenerKey;
    var self = this;

    function animating(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        var elapsed = frameState.time - start;
        var opacity = elapsed / (duration / times * 1.25);

        var style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(76,140,88,' + opacity + ')'
            })
        });
        vectorContext.drawFeature(self.clone(), style);

        if (opacity >= 0.8) {
            start = frameState.time;
            opacity = 0;
        }

        if ((frameState.time - firstTime) > duration) {
            ol.Observable.unByKey(listenerKey);
            map.render();
            self.show();
            return;
        }
        // tell OL3 to continue postcompose animation
        map.render();
    }
    listenerKey = map.on('postcompose', animating);
    map.render();
};

Ez.Overlay.prototype.hexToRgb_ = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzOverlay', Ez.Overlay);
