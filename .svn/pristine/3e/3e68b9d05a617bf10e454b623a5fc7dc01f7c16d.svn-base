/*
/-----------------------------------------------------------------------------------  
/			Ez.Coordinate.js
/-----------------------------------------------------------------------------------
*/
goog.provide('Ez.Coordinate');

goog.require('goog.asserts');

/**
 * EzServerClient Coordinate 坐标序列
 *
 * @constructor
 * @param {number} [x] 经度
 * @param {number} [y] 纬度
 */
Ez.Coordinate = function(x, y) {
    goog.asserts.assert(goog.isDef(x), '经度坐标不能为空');
    goog.asserts.assert(goog.isDef(y), '纬度坐标不能为空');

    this.coordinate_ = [parseFloat(x), parseFloat(y)];
};

/**
 * 坐标点对象，用来存储坐标信息
 * @return {ol.Coordinate} 返回坐标数组格式
 */
Ez.Coordinate.prototype.getCoordinate = function() {
    return this.coordinate_;
};

Ez.Coordinate.prototype.toStringXY = function() {
    var coords = this.coordinate_;
    return coords[0] + ',' + coords[1];
};

/**
 * 计算两坐标点之间的距离
 * @param  {EzCoord} destCoord
 * @return {Number}
 */
Ez.Coordinate.prototype.distanceTo = function(destCoord) {
    var p1 = this.getCoordinate();
    var p2 = destCoord.getCoordinate();

    var meter = ol.sphere.WGS84.haversineDistance(p1, p2);

    return meter;
};


// 以下为需要保留的类名以及方法
goog.exportSymbol('EzCoord', Ez.Coordinate);
