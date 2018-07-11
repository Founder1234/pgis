/*
|------------------------------------------------------------------------------
|                               Ez.MBR              
|
|@author: qianleyi
|@date: 2015-12-9
|@descript: 地图包络框对象类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.MBR');

goog.require('ol.extent');

/**
 * @class 
 * MBR包络框，包含四个值的数组
 * @param {number} [minX]
 * @param {number} [minY]
 * @param {number} [maxX]
 * @param {number} [maxY]
 * @constructor
 */
Ez.MBR = function(minX, minY, maxX, maxY) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.value_ = [minX, minY, maxX, maxY];
};

/**
 * 获取MBR的中心点坐标
 * @return {ol.Coordinate|Array} Coordinate
 */
Ez.MBR.prototype.centerPoint = function(isReturnEzCoord) {
    var centerPoint = ol.extent.getCenter(this.value_);
    if (isReturnEzCoord) {
        return new Ez.Coordinate(centerPoint[0], centerPoint[1]);
    } else {
        return centerPoint;
    }
};

/**
 * 该实例对象是否包含目标包络框
 * @param  {Ez.MBR} [pMBR] 目标包络框
 * @return {boolean}
 */
Ez.MBR.prototype.containsBounds = function(pMBR) {
    return ol.extent.containsExtent(this.value_, pMBR.value_);
};

/**
 * 该实例对象是否包含目标点
 * @param  {ol.Coordinate} point
 * @return {boolean}
 */
Ez.MBR.prototype.containsPoint = function(point) {
    var coords;
    if (point instanceof Ez.Coordinate) {
        coords = point.getCoordinate();
    } else {
        coords = point;
    }
    return ol.extent.containsCoordinate(this.value_, coords);
};

/**
 * 获取数组形式的mbr
 * @return {Number[]} [description]
 */
Ez.MBR.prototype.getExtent = function() {
    return this.value_;
};

/**
 * 输出对角线坐标序列
 * @return {String}
 */
Ez.MBR.prototype.toBBoxString = function() {
    return this.minX + ',' + this.minY + ',' + this.maxX + ',' + this.maxY;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzMBR', Ez.MBR);
