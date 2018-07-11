goog.provide('Ez.g.Rectangle');

goog.require('ol.geom.Polygon');
goog.require('Ez.Overlay');
goog.require('Ez.Coordinate');
goog.require('ol.style.Style');
goog.require('ol.style.Fill');
goog.require('ol.style.Image');


/**
 * @classdes
 * EzServerClient Rectangle要素类
 * @extends {Ez.Overlay}
 *
 * @param {string|Array.<ol.Coordinate>} [coordinates] 坐标序列或者坐标数组
 * @param {options} [opt_style] 样式对象
 * @param {ol.geom.GeometryLayout=} [opt_layout] layout 
 */
Ez.g.Rectangle = function(coordinates, opt_style, options) {
    var coordinatesArr = [];
    var styleOfGeom;
    var coordString = '';

    if (goog.isString(coordinates)) {
        var coorArr = coordinates.split(',');
        if (coorArr.length === 4) {
            /** 当矩形通过亮点确定时（左上角、右下角） */
            coordString += coordinates;
            coordinatesArr.push([parseFloat(coorArr[0]), parseFloat(coorArr[1])]);
            coordinatesArr.push([parseFloat(coorArr[0]), parseFloat(coorArr[3])]);
            coordinatesArr.push([parseFloat(coorArr[2]), parseFloat(coorArr[3])]);
            coordinatesArr.push([parseFloat(coorArr[2]), parseFloat(coorArr[1])]);
            coordinatesArr.push([parseFloat(coorArr[0]), parseFloat(coorArr[1])]);
        } else {
            /** 坐标序列时 */
            coordString += coordinates;
            coordinatesArr.push([parseFloat(coorArr[0]), parseFloat(coorArr[1])]);
            coordinatesArr.push([parseFloat(coorArr[2]), parseFloat(coorArr[3])]);
            coordinatesArr.push([parseFloat(coorArr[4]), parseFloat(coorArr[5])]);
            coordinatesArr.push([parseFloat(coorArr[6]), parseFloat(coorArr[7])]);
            coordinatesArr.push([parseFloat(coorArr[0]), parseFloat(coorArr[1])]);
        }
    } else if (goog.isArray(coordinates)) {
        /** 顺时针存储矩形边界点信息——依次为左上，右上，右下，左下 */
        if (coordinates[0] instanceof Ez.Coordinate) {

            coordinatesArr.push(coordinates[0].getCoordinate());
            coordString += coordinates[0].getCoordinate();
            coordinatesArr.push(coordinates[1].getCoordinate());
            coordString += ',';
            coordinatesArr.push(coordinates[2].getCoordinate());
            coordString += coordinates[2].getCoordinate();
            coordinatesArr.push(coordinates[3].getCoordinate());

            coordinatesArr.push(coordinates[0].getCoordinate());

        } else {
            //2016-04-26修改coorString返回对角点坐标序列 
            //这里coordString的坐标是按最小最大排列的
            //qianleyi

            coordinates = coordinates[0];
            coordinatesArr.push(coordinates[0]);
            coordString += coordinates[0][0] + ',' + coordinates[2][1] + ',';
            coordinatesArr.push(coordinates[1]);

            coordinatesArr.push(coordinates[2]);
            coordString += coordinates[2][0] + ',' + coordinates[0][1];
            coordinatesArr.push(coordinates[3]);

            coordinatesArr.push(coordinates[0]);
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
        // var strokeColor = ol.color.asArray(goog.isDef(opts.strokeColor) ? opts.strokeColor : '#FFCC33');
        // strokeColor[3] = goog.isDef(opts.strokeOpacity) ? opts.strokeOpacity : 1;
        var strokeColorString = goog.isDef(opts.strokeColor) ? opts.strokeColor : '#FFCC33';
        var strokeColor = this.hexToRgb_(strokeColorString);
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

    coordinatesArr = [coordinatesArr];
    var featureParam = {
        geometry: new ol.geom.Polygon(coordinatesArr)
    };
    goog.base(this, featureParam);

    this.coordString = coordString;
    //增加类型标识，用于地图打印服务
    this.rectFlag = true;
    this.setStyle(styleOfGeom);
    // 添加可拖拽标识
    var opts_other = options ? options : {};
    if (opts_other.draggable) {
        this.set('draggable', opts_other.draggable);
    }
};
goog.inherits(Ez.g.Rectangle, Ez.Overlay);

/**
 * getter Center
 * @return {Ez.Coordinate}
 */
Ez.g.Rectangle.prototype.getCenter = function() {
    var extent = this.getGeometry().getExtent();
    var centerPoint = ol.extent.getCenter(extent);
    return new Ez.Coordinate(centerPoint[0], centerPoint[1]);
};

/**
 * 获取坐标组
 * @return {[type]} [description]
 */
Ez.g.Rectangle.prototype.getPoints = function() {
    var geometry = this.getGeometry();
    var arr = geometry.getCoordinates();
    arr.map(function(ele) {
        ele.pop();
    });
    return arr;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('Rectangle', Ez.g.Rectangle);
