goog.provide('Ez.g.Circle');

goog.require('ol.geom.Circle');
goog.require('Ez.Overlay');
goog.require('Ez.Coordinate');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');



/**
 * @classdes
 * EzServerClient Circle要素类
 * @extends {Ez.Overlay}
 *
 * @param {Ez.Coordinate} [coordinate] 坐标序列或者坐标数组
 * @param {number} [radius] 圆半径
 * @param {options} [opt_style] 样式对象
 * @param {ol.geom.GeometryLayout=} [opt_layout] layout 
 *
 * @namespace Ez.g
 */
Ez.g.Circle = function(coordinate, radius, opt_style, options) {

    var styleOfGeom;
    var coordinatesArr;
    var coordString = '';

    if (goog.isString(coordinate)) {
        coordinatesArr = coordinate.split(',');
        coordString = coordinate;
    } else if (coordinate instanceof Ez.Coordinate) {
        coordinatesArr = coordinate.getCoordinate();
        coordString = coordinate.toStringXY();
    } else {
        goog.asserts.assert(false, '坐标点必须是EzCoord对象');
    }

    radius = parseFloat(radius);

    var opts = opt_style ? opt_style : {};


    //----------------------------------------------------------------------
    //统一处理半径问题：OL3规定的圆的半径是按照坐标参考的单位来确定圆的半径单位的。也就是说'EPSG:4326'的单位是degree,'EPSG:3857'的单位是meter.
    //现在把传入的坐标统一成meter
    if (!opts.isMeter) {
        var p1 = coordinatesArr;
        var p2 = [p1[0] + 1, p1[1]];
        var dmeter = ol.sphere.WGS84.haversineDistance(p1, p2);
        radius = 1 * radius / dmeter;
    }
    //----------------------------------------------------------------------

    if (!goog.isNumber(radius)) {
        goog.asserts.assert(false, '圆形半径必须为数值型');
    }

    /**
     * 定义样式
     */
    if (goog.isDef(opt_style)) {
        // var fillColor = ol.color.asArray(goog.isDef(opts.fillColor) ? opts.fillColor : '#FFFFFF');
        // fillColor[3] = goog.isDef(opts.fillOpacity) ? opts.fillOpacity : 0.5;
        var fillColorString = goog.isDef(opts.fillColor) ? opts.fillColor : '#FFFFFF';
        var fillColor = this.hexToRgb_(fillColorString);
        fillColor[3] = goog.isDef(opts.fillOpacity) ? opts.fillOpacity : 0.5;
        var strokeColor = ol.color.asArray(goog.isDef(opts.strokeColor) ? opts.strokeColor : '#FFCC33');
        strokeColor[3] = goog.isDef(opts.strokeOpacity) ? opts.strokeOpacity : 1;
        //stroke线性设置
        var strokeLineDash = goog.isDef(opts.strokeLineDash) ? opts.strokeLineDash : undefined;

        styleOfGeom = new ol.style.Style({
            fill: new ol.style.Fill({
                color: fillColor
            }),
            stroke: new ol.style.Stroke({
                color: strokeColor,
                width: goog.isDef(opts.strokeWidth) ? parseInt(opts.strokeWidth) : 2,
                lineDash: strokeLineDash
            })
        });
    } else {
        styleOfGeom = new ol.style.Style({
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.5]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 204, 51, 1],
                width: 2
            })
        });
    }

    var featureParam = {
        geometry: new ol.geom.Circle(coordinatesArr, radius)
    };
    goog.base(this, featureParam);

    this.coordString = coordString;
    //增加类型标识，用于地图打印服务
    this.circleFlag = true;
    this.setStyle(styleOfGeom);
    // 添加可拖拽标识
    var opts_other = options ? options : {};
    if (opts_other.draggable) {
        this.set('draggable', opts_other.draggable);
    }
};
goog.inherits(Ez.g.Circle, Ez.Overlay);

/**
 * getter 获取圆的中心坐标
 * @return {EzCoord}
 */
Ez.g.Circle.prototype.getCenter = function() {
    var coords = this.getGeometry().getCenter();
    return new Ez.Coordinate(coords[0], coords[1]);
};

/**
 * setter 设置圆的中心坐标
 * @param {EzCoord} coords
 */
Ez.g.Circle.prototype.setCenter = function(coords) {
    this.getGeometry().setCenter(coords.getCoordinate());
};

/**
 * getter 获取圆半径
 * @return {number}
 */
Ez.g.Circle.prototype.getRadius = function() {
    var p1 = this.getGeometry().getCenter();
    var p2 = [p1[0] + 1, p1[1]];
    var dmeter = ol.sphere.WGS84.haversineDistance(p1, p2);
    var radius = this.getGeometry().getRadius();
    return radius * dmeter;
};

/**
 * setter 设置圆半径
 * @param {Number} 半径单位为m
 */
Ez.g.Circle.prototype.setRadius = function(number) {

    var p1 = this.getGeometry().getCenter();
    var p2 = [p1[0] + 1, p1[1]];
    var dmeter = ol.sphere.WGS84.haversineDistance(p1, p2);
    this.getGeometry().setRadius(number / dmeter);
};

/**
 * 判断坐标点是否在圆内
 * @param  {Ez。Coordinate}  coords 
 * @return {Boolean} 
 */
Ez.g.Circle.prototype.isPointInCircle = function(coords) {
    var center = this.getGeometry().getCenter();
    var radius = this.getGeometry().getRadius();

    var point = coords.getCoordinate();

    var distance2 = (center[0] - point[0]) * (center[0] - point[0]) + (center[1] - point[1]) * (center[1] - point[1]);

    return !(distance2 > radius * radius);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('Circle', Ez.g.Circle);
