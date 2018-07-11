goog.provide('Ez.g.Point');

goog.require('ol.geom.Point');
goog.require('Ez.Overlay');
goog.require('Ez.Coordinate');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Image');


/**
 * EzServerClient Point要素类
 * @extends {Ez.Overlay}
 *
 * @param {float} [x] 坐标X
 * @param {float} [y] 坐标y
 * @param {ol.geom.GeometryLayout=} [opt_layout] layout 
 */
Ez.g.Point = function(coordinate, opt_style, options) {
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

    /**
     * 定义样式
     */
    if (goog.isDef(opt_style)) {
        // var fillColor = ol.color.asArray(goog.isDef(opt_style.fillColor) ? opt_style.fillColor : '#FFFFFF');
        // fillColor[3] = goog.isDef(opt_style.fillOpacity) ? opt_style.fillOpacity : 1;
        var fillColorString = goog.isDef(opt_style.fillColor) ? opt_style.fillColor : '#FFFFFF';
        var fillColor = this.hexToRgb_(fillColorString);
        fillColor[3] = goog.isDef(opt_style.fillOpacity) ? opt_style.fillOpacity : 1;
        var strokeColor = ol.color.asArray(goog.isDef(opt_style.strokeColor) ? opt_style.strokeColor : '#FFCC33');
        strokeColor[3] = goog.isDef(opt_style.strokeOpacity) ? opt_style.strokeOpacity : 1;

        styleOfGeom = new ol.style.Style({
            image: new ol.style.Circle({
                radius: goog.isDef(opt_style.radius) ? opt_style.radius : 7,
                fill: new ol.style.Fill({
                    color: fillColor
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor,
                    width: goog.isDef(opt_style.strokeWidth) ? parseInt(opt_style.strokeWidth) : 2
                })
            })
        });
    } else {
        styleOfGeom = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: [255, 255, 255, 1]
                }),
                stroke: new ol.style.Stroke({
                    color: [255, 204, 51, 1],
                    width: 2
                })
            })
        });
    }

    var featureParam = {
        geometry: new ol.geom.Point(coordinatesArr),
        otherOptions: options
    };
    goog.base(this, featureParam);

    this.coordString = coordString;
    this.setStyle(styleOfGeom);
    // 添加可拖拽标识
    var opts_other = options ? options : {};
    if (opts_other.draggable) {
        this.set('draggable', opts_other.draggable);
    }
};
goog.inherits(Ez.g.Point, Ez.Overlay);

/**
 * 获取点的中心坐标值
 * @return {Ez.Coordinate}
 */
Ez.g.Point.prototype.getCenter = function() {
    var ol_Coor = this.getGeometry().getCoordinates();
    return new Ez.Coordinate(ol_Coor[0], ol_Coor[1]);
};

/**
 * 更新点的中心坐标值
 * @param {EzCoord} coords 坐标对象
 */
Ez.g.Point.prototype.setCenter = function(coords) {
    if (!coords) throw new Error('坐标对象不能为空！');

    var coordinates = coords.getCoordinate();
    var geometry = this.getGeometry();
    geometry.setCoordinates(coordinates);
};

/**
 * Fill Color Getter
 * @return {string}
 */
Ez.g.Point.prototype.getFillColor = function() {
    var style = this.getStyle();
    var fillstyle = style.getImage().getFill();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    return ol.color.asString(colorarray);
};

/**
 * Fill Opacity Getter
 * @return {number}
 */
Ez.g.Point.prototype.getFillOpacity = function() {
    var style = this.getStyle();
    var fillstyle = style.getImage().getFill();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    return parseFloat(colorarray[3]);
};

/**
 * Circle Radius Getter
 * @return {number}
 */
Ez.g.Point.prototype.getRadius = function() {
    var style = this.getStyle();
    var circlestyle = style.getImage();
    return circlestyle.getRadius();
};

/**
 * 更新点要素的像素半径
 * @param {Number} rad
 */
Ez.g.Point.prototype.setRadius = function(rad) {
    if (!rad) throw new Error('像素半径不能为空！');

    var style = this.getStyle();
    // image 是一个ol.style.Circle对象
    var image = style.getImage();
    var fill = image.getFill();
    var stroke = image.getStroke();
    var newStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: rad,
            fill: new ol.style.Fill({
                color: fill.getColor()
            }),
            stroke: new ol.style.Stroke({
                color: stroke.getColor(),
                width: stroke.getWidth()
            })
        })
    });
    this.setStyle(newStyle);
};

/**
 * Fill Color Setter
 * @param {string} colorString
 */
Ez.g.Point.prototype.setFillColor = function(colorString) {
    var style = this.getStyle();
    var fillstyle = style.getImage().getFill();
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
Ez.g.Point.prototype.setFillOpacity = function(opacity) {
    goog.asserts.assert((opacity >= 0 && opacity <= 1), '设置的透明度必须在[0,1]范围内');
    var style = this.getStyle();
    var fillstyle = style.getImage().getFill();
    var colorarray = ol.color.asArray(fillstyle.getColor());
    colorarray[3] = opacity;
    fillstyle.setColor(colorarray);
    this.setStyle(style);
};

/**
 * Stroke Color Getter
 * @return {string}
 */
Ez.g.Point.prototype.getStrokeColor = function() {
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    return ol.color.asString(colorarray);
};

/**
 * Stroke Width Getter
 * @return {number}
 */
Ez.g.Point.prototype.getStrokeWidth = function() {
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
    return strokestyle.getWidth();
};

/**
 * Stroke Opacity Getter
 * @return {number}
 */
Ez.g.Point.prototype.getStrokeOpacity = function() {
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    return parseFloat(colorarray[3]);
};

/**
 * Stroke Color Setter
 * @param {string} colorString
 */
Ez.g.Point.prototype.setStrokeColor = function(colorString) {
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
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
Ez.g.Point.prototype.setStrokeWidth = function(number) {
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
    strokestyle.setWidth(number);
    this.setStyle(style);
};

/**
 * Stroke Opacity Setter
 * @param {number} opacity 0 <= opacity <= 1
 */
Ez.g.Point.prototype.setStrokeOpacity = function(opacity) {
    goog.asserts.assert((opacity >= 0 && opacity <= 1), '设置的透明度必须在[0,1]范围内');
    var style = this.getStyle();
    var strokestyle = style.getImage().getStroke();
    var colorarray = ol.color.asArray(strokestyle.getColor());
    colorarray[3] = opacity;
    strokestyle.setColor(colorarray);
    this.setStyle(style);
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('Point', Ez.g.Point);
