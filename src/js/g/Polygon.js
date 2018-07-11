goog.provide('Ez.g.Polygon');

goog.require('ol.geom.Polygon');
goog.require('Ez.Overlay');
goog.require('Ez.Coordinate');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');


/**
 * @classdes
 * EzServerClient Polygon要素类
 * @extends {Ez.Overlay}
 *
 * @param {string|Array.<ol.Coordinate>} [coordinates] 坐标序列或者坐标数组
 * @param {options} [opt_style] 样式对象
 * @param {ol.geom.GeometryLayout=} [opt_layout] layout 
 *
 * @namespace Ez.g
 */
Ez.g.Polygon = function(coordinates, opt_style, options) {
    /** 定义Polygon要素坐标串 */
    var coordString = '';
    var coordinatesArr;
    var styleOfGeom;
    var coordinatesArrs;

    if (goog.isString(coordinates)) {
        var multiCoordArrs = coordinates.split(';');
        coordinatesArrs = [];

        //第一层多个多边形区分
        for (var j = 0; j < multiCoordArrs.length; j++) {
            var coorArr = multiCoordArrs[j].split(',');
            var coordinatesArr = [];
            for (var i = 0; i < coorArr.length - 1; i++) {
                coordinatesArr.push([parseFloat(coorArr[i]), parseFloat(coorArr[i + 1])]);
                i++;
            }
            coordinatesArrs.push(coordinatesArr);
        }

        coordString = coordinates;
    } else if (goog.isArray(coordinates)) {
        coordinatesArrs = [];
        for (var j = 0; j < coordinates.length; j++) {
            var coordinatesArr = [];
            for (var i = 0; i < coordinates[j].length; i++) {
                if (coordinates[j][i] instanceof Ez.Coordinate) {
                    coordString += coordinates[j][i].toStringXY();
                    coordinatesArr.push(coordinates[j][i].getCoordinate());
                } else {
                    coordString += coordinates[j][i][0] + ',' + coordinates[j][i][1];
                    coordinatesArr.push(coordinates[j][i]);
                }
                if (i !== coordinates[j].length - 1) {
                    coordString += ',';
                }
            }
            coordinatesArrs.push(coordinatesArr);
            if (j !== coordinates.length - 1) {
                coordString += ';';
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
        geometry: new ol.geom.Polygon(coordinatesArrs)
    };
    goog.base(this, featureParam);

    this.coordString = coordString;
    //增加类型标识，用于地图打印服务
    this.polygonFlag = true;
    this.setStyle(styleOfGeom);
    // 添加可拖拽标识
    var opts_other = options ? options : {};
    if (opts_other.draggable) {
        this.set('draggable', opts_other.draggable);
    }
};
goog.inherits(Ez.g.Polygon, Ez.Overlay);

/**
 * 读取GeoJSON数据构造对象
 * @return {[type]} [description]
 */
Ez.g.Polygon.readGeoJSON = function(geojson, opts_style) {
    var feature = Ez.Overlay.readGeoJSON.call(this, geojson);
    var coords = feature.getGeometry().getCoordinates();
    return new Ez.g.Polygon(coords, opts_style);
};

/**
 * getter Center
 * @return {Ez.Coordinate}
 */
Ez.g.Polygon.prototype.getCenter = function() {
    var centerPoint = this.getGeometry().getInteriorPoint().getCoordinates();
    return new Ez.Coordinate(centerPoint[0], centerPoint[1]);
};

/**
 * 获取坐标组
 * @return {[type]} [description]
 */
Ez.g.Polygon.prototype.getPoints = function() {
    var geometry = this.getGeometry();
    var arr = geometry.getCoordinates();
    arr.map(function(ele) {
        ele.pop();
    });
    return arr;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('Polygon', Ez.g.Polygon);
