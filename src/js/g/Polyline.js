goog.provide('Ez.g.Polyline');

goog.require('ol.geom.LineString');
goog.require('Ez.Overlay');
goog.require('Ez.Coordinate');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');


/**
 * EzServerClient Polyline要素类
 * @extends {Ez.Overlay}
 *
 * @param {string|Array<ol.Coordinate>} [coordinate] 坐标序列或者坐标数组
 * @param {options} [opt_style] 样式对象
 * @param {ol.geom.GeometryLayout=} [opt_layout] layout
 *
 * @namespace Ez.g
 */
Ez.g.Polyline = function(coordinates, opt_style, options) {
    /** 定义数据变量 */
    var coordinatesArr;
    var coordString = '';
    var styleOfGeom;

    if (goog.isString(coordinates)) {
        var coorArr = coordinates.split(',');
        coordinatesArr = [];
        for (var i = 0; i < coorArr.length - 1; i++) {
            coordinatesArr.push([parseFloat(coorArr[i]), parseFloat(coorArr[i + 1])]);
            i++;
        }
        coordString = coordinates;
    } else if (goog.isArray(coordinates)) {
        coordinatesArr = [];
        for (var j = 0; j < coordinates.length; j++) {
            if (coordinates[j] instanceof Ez.Coordinate) {
                coordString += coordinates[j].toStringXY();
                coordinatesArr.push(coordinates[j].getCoordinate());
            } else {
                coordString += coordinates[j][0] + ',' + coordinates[j][1];
                coordinatesArr.push(coordinates[j]);
            }
            if (j !== coordinates.length - 1) {
                coordString += ',';
            }
        }
    } else {
        goog.asserts.assert(false, '坐标格式不对');
    }

    var opts = opt_style ? opt_style : {};

    /**
     * 定义样式
     */
    if (goog.isDef(opt_style)) {
        // var strokeColor = ol.color.asArray(goog.isDef(opts.strokeColor) ? opts.strokeColor : '#FFCC33');
        var strokeColorString = goog.isDef(opts.strokeColor) ? opts.strokeColor : '#FFCC33';
        var strokeColor = this.hexToRgb_(strokeColorString);
        strokeColor[3] = goog.isDef(opts.strokeOpacity) ? opts.strokeOpacity : 1;
        //stroke线性设置
        var strokeLineDash = goog.isDef(opts.strokeLineDash) ? opts.strokeLineDash : undefined;

        styleOfGeom = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: goog.isDef(opts.strokeWidth) ? parseInt(opts.strokeWidth) : 2,
                lineDash: strokeLineDash
            })
        });
    } else {
        styleOfGeom = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 204, 51, 1],
                width: 2
            })
        });
    }

    var featureParam = {
        geometry: new ol.geom.LineString(coordinatesArr)
    };
    goog.base(this, featureParam);

    this.coordString = coordString;
    //增加类型标识，用于地图打印服务
    this.polylineFlag = true;
    this.setStyle(styleOfGeom);
    // 添加可拖拽标识
    var opts_other = options ? options : {};
    if (opts_other.draggable) {
        this.set('draggable', opts_other.draggable);
    }

    // 事件处理函数绑定作用域
    this.onHandleChange = this.onHandleChange.bind(this);
};
goog.inherits(Ez.g.Polyline, Ez.Overlay);

/**
 * 处理要素变化事件
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
Ez.g.Polyline.prototype.onHandleChange = function(evt) {
    var lastCoords = this.getGeometry().getLastCoordinate();
    var point = this.pointFeature_.getGeometry();
    var pointCoord = point.getCoordinates();
    if (lastCoords[0] !== pointCoord[0] && lastCoords[1] !== pointCoord[1]) {
        point.setCoordinates(lastCoords);
    }
};

/**
 * [onRemove description]
 * @param  {Ez.Map} map 
 */
Ez.g.Polyline.prototype.onRemove = function(map) {
    this.map_ = null;

    //default vector 图层
    var vectorLayers = map.getVectorLayers();
    var vectorEle = this;
    vectorLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);

            if (vectorEle.pointFeature_) {
                vectorLayer.getSource().removeFeature(vectorEle.pointFeature_);
                vectorEle.un('change', vectorEle.onHandleChange);
                delete vectorEle.pointFeature_;
            }

            vectorLayer.getSource().removeFeature(vectorEle);
        }
    });
};

/**
 * 重构基类方法
 */
Ez.g.Polyline.prototype.show = function() {
    if (this.get('isAddToMap')) return;
    //default vector 图层
    var layers = this.map_.getVectorLayers();
    var element = this;
    layers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            if (element.pointFeature_) {
                vectorLayer.getSource().addFeature(element.pointFeature_);
            }
            vectorLayer.getSource().addFeature(element);
        }
    });
    this.set('isAddToMap', true);
};

/**
 * 重构基类方法
 */
Ez.g.Polyline.prototype.hide = function() {
    if (!this.get('isAddToMap')) return;
    //default vector 图层
    var layers = this.map_.getVectorLayers();
    var element = this;
    layers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
            if (element.pointFeature_) {
                vectorLayer.getSource().removeFeature(element.pointFeature_);
            }
            vectorLayer.getSource().removeFeature(element);
        }
    });
    this.set('isAddToMap', false);
};

/**
 * 返回线段的第一个点
 * @return {Ez.Coordinate}
 */
Ez.g.Polyline.prototype.getFirstPoint = function() {
    var ps = this.getPoints();
    return new Ez.Coordinate(ps[0][0], ps[0][1])
};

/**
 * 线段的中心位置，如果线段由奇数段组成返回中心段的中心点；如果线段由偶数段组成返回段的中间端点
 * @return {Ez.Coordinate}
 */
Ez.g.Polyline.prototype.getCenter = function() {
    var points = this.getGeometry().getCoordinates();
    var len = points.length;
    var remainder = len % 2;
    // 如果余数等于1，就取所有点的中间点; 如果余数等于0，就取中间两个点，再计算两个点的中点
    if (remainder === 1) {
        var coords = points[Math.floor(len / 2)];
        return new Ez.Coordinate(coords[0], coords[1]);
    } else if (remainder === 0) {
        var starter = points[len / 2 - 1];
        var ender = points[len / 2];
        var coords = [(starter[0] + ender[0]) / 2, (starter[1] + ender[1]) / 2];
        return new Ez.Coordinate(coords[0], coords[1]);
    } else {
        goog.assert(false, "线段的长度存在异常值");
    }
};

/**
 * Fill Color Getter
 * @return {string}
 */
Ez.g.Polyline.prototype.getFillColor = function() {};

/**
 * Fill Opacity Getter
 * @return {number}
 */
Ez.g.Polyline.prototype.getFillOpacity = function() {};

/**
 * Fill Color Setter
 * @param {string} colorString
 */
Ez.g.Polyline.prototype.setFillColor = function(colorString) {};

/**
 * Fill Opacity Setter
 * @param {number} opacity 0 <= opacity <= 1
 */
Ez.g.Polyline.prototype.setFillOpacity = function(opacity) {};

/**
 * 重构函数：设置线颜色
 * @param {[type]} colorString [description]
 */
Ez.g.Polyline.prototype.setStrokeColor = function(colorString) {
    var style = this.getStyle();
    var strokestyle = this.getStrokeStyle_();
    var currentOpacity = ol.color.asArray(strokestyle.getColor())[3];
    var colorarray = ol.color.asArray(colorString);
    colorarray[3] = currentOpacity;
    strokestyle.setColor(colorarray);
    this.setStyle(style);
    if (this.pointFeature_) {
        var pointImage = this.pointFeature_.getStyle().getImage();
        var newPointStyle = new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: colorarray
                }),
                stroke: new ol.style.Stroke({
                    color: colorarray,
                    width: 1
                }),
                points: 3,
                radius: pointImage.getRadius(),
                rotation: pointImage.getRotation(),
                angle: Math.PI / 2
            })
        });
        this.pointFeature_.setStyle(newPointStyle);
    }
};

/**
 * 重构函数：设置线透明度
 * @param {[type]} opacity [description]
 */
Ez.g.Polyline.prototype.setStrokeOpacity = function(opacity) {
    goog.asserts.assert((opacity >= 0 && opacity <= 1), '设置的透明度必须在[0,1]范围内');
    var style = this.getStyle();
    var strokestyle = this.getStrokeStyle_();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    colorarray[3] = opacity;
    strokestyle.setColor(colorarray);
    this.setStyle(style);
    if (this.pointFeature_) {
        var pointImage = this.pointFeature_.getStyle().getImage();
        var newPointStyle = new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({
                    color: colorarray
                }),
                stroke: new ol.style.Stroke({
                    color: colorarray,
                    width: 1
                }),
                points: 3,
                radius: pointImage.getRadius(),
                rotation: pointImage.getRotation(),
                angle: Math.PI / 2
            })
        });
        this.pointFeature_.setStyle(newPointStyle);
    }
};

/**
 * 获取坐标组
 * @return {[type]} [description]
 */
Ez.g.Polyline.prototype.getPoints = function() {
    var geometry = this.getGeometry();
    return geometry.getCoordinates();
};

/**
 * 在直线末端设置箭头
 * @param {Object} options 
 */
Ez.g.Polyline.prototype.addArrowHead = function(options) {

    var opts = options || {};

    if (this.get('isArrowHead')) {
        return;
    }

    /** 基本思路：添加另外一个要素到线段的指定位置 */

    var geometry = this.getGeometry();
    var coords = geometry.getCoordinates();

    var map = this.map_;

    /** 最后两个点 */
    var len = coords.length;
    var startPoint = coords[len - 2];
    var endPoint = coords[len - 1];
    var dx = endPoint[0] - startPoint[0];
    var dy = endPoint[1] - startPoint[1];
    var rotate = Math.atan2(dy, dx);
    if (rotate > 0) {
        var rad = 360 - (180 * parseFloat(rotate) / Math.PI);
        rotate = rad * Math.PI / 180;
    } else {
        rotate = Math.abs(Number(rotate));
    }

    // 获取要素的样式
    var style = this.getStyle();
    var strokeStyle = style.getStroke();
    var strokeColor = strokeStyle.getColor();

    /** Fill */
    var fill = new ol.style.Fill({
        color: strokeColor
    });
    /** Stroke */
    var stroke = new ol.style.Stroke({
        color: strokeColor,
        width: 1
    });
    /** OL3 Native */
    var pointstyle = new ol.style.Style({
        image: new ol.style.RegularShape({
            fill: fill,
            stroke: stroke,
            points: 3,
            radius: opts.radius || 10,
            rotation: rotate,
            angle: Math.PI / 2
        })
    });
    var geomPoint = new ol.geom.Point(endPoint);
    var pointFeature = new ol.Feature({
        geometry: geomPoint
    });
    pointFeature.setStyle(pointstyle);
    /** 图层 */
    var vectorLayers = map.getVectorLayers();
    vectorLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'vector_default') {
            var vectorLayer = ele;
            vectorLayer.getSource().addFeature(pointFeature);
        }
    });
    this.pointFeature_ = pointFeature;
    this.set('isArrowHead', true);

    // 添加change事件监听
    this.on('change', this.onHandleChange);
};

/**
 * 移除箭头
 * @return {[type]} [description]
 */
Ez.g.Polyline.prototype.removeArrowHead = function() {
    if (this.pointFeature_) {
        this.un('change', this.onHandleChange);
        var layers = this.map_.getVectorLayers();
        var element = this;
        layers.getLayers().forEach(function(ele, index, arr) {
            if (ele.get('name') === 'vector_default') {
                var vectorLayer = /** @type {ol.layer.Vector} */ (ele);
                if (element.pointFeature_) {
                    vectorLayer.getSource().removeFeature(element.pointFeature_);
                    delete element.pointFeature_;
                }
            }
        });
    }
};

/**
 * 获取箭头的顶点坐标（当前分辨率下）
 * @param  {Number} zoom 
 * @return {Ez.Coordinate[]}
 */
Ez.g.Polyline.prototype.getArrowHeadPositions = function(zoom) {
    if (!this.get('isArrowHead')) {
        return;
    }
    var pointFeature = this.pointFeature_;
    var stylePoint = pointFeature.getStyle().getImage();
    var center = pointFeature.getGeometry().getCoordinates();
    var rotation = stylePoint.getRotation();
    var radius = stylePoint.getRadius();
    var map = this.map_;
    // 获取当前缩放级别
    var currentZoom = map.getZoom();
    zoom = zoom ? zoom : currentZoom;
    var dzoom = currentZoom - zoom;
    if (dzoom > 0) {
        radius = Math.pow(2, dzoom) * radius;
    } else if (dzoom < 0) {
        radius = 1 / Math.pow(2, -dzoom) * radius;
    }
    // 根据坐标计算中心点的像素坐标
    var pixel = map.getPixelFromCoordinate(center);
    if (!pixel) return;
    return this.batchPixelsToCoordinates_(map, this.calcVertexs_(pixel, radius, rotation));
};

/**
 * 根据中心像素坐标，半径大小，旋转弧度值计算三个顶点的像素坐标
 * @param  {Number[]} pixels
 * @param  {Number} radius
 * @param  {Number} rotation
 * @return {Number[]}
 */
Ez.g.Polyline.prototype.calcVertexs_ = function(pixels, radius, rotation) {
    // 中心像素坐标变量
    var centerX = pixels[0];
    var centerY = pixels[1];
    // 计算顶点的像素坐标
    var vertex_a = [centerX + radius * Math.cos(rotation), centerY + radius * Math.sin(rotation)];
    var vertex_b = [centerX - radius * Math.cos(Math.PI / 3 - rotation), centerY + radius * Math.sin(Math.PI / 3 - rotation)];
    var vertex_c = [centerX + radius * Math.cos(Math.PI / 3 * 2 - rotation), centerY - radius * Math.sin(Math.PI / 3 * 2 - rotation)];

    return [vertex_a, vertex_b, vertex_c];
};

/**
 * 工具接口，实现批量像素坐标转空间坐标
 * @param  {Ez.Map} map
 * @param  {Number[]} pixels
 * @return {Number[]}
 */
Ez.g.Polyline.prototype.batchPixelsToCoordinates_ = function(map, pixels) {
    var results = [];
    for (var i = 0; i < pixels.length; i++) {
        var coords = map.getCoordinateFromPixel(pixels[i]);
        results.push(coords[0]);
        results.push(coords[1]);
    }
    return results.join(',');
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('Polyline', Ez.g.Polyline);
