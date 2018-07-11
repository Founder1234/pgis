/**
 * 地图包络框类
 * @constructor
 * @param {Number} minX - 包络框左上角经度
 * @param {Number} minY - 包络框左上角纬度
 * @param {Number} maxX - 包络框右下角经度
 * @param {Number} maxY - 包络框右下角纬度
 * @extends {olClass.extent}
 */
var EzMBR = function(minX, minY, maxX, maxY) {};

EzMBR.prototype =
    /** @lends EzMBR.prototype */
    {
        /**
         * 获取包络框的中心地理坐标
         * @param  {Boolean} isReturnEzCoord - 是否返回{@link EzCoord}
         * @return {Number[]|EzCoord}  中心地理坐标
         */
        centerPoint: function(isReturnEzCoord) {},

        /**
         * 目标包络框是否被包含在内
         * @param  {EzMBR} pmbr - 目标包络框
         * @return {Boolean} 是否被包含
         */
        containsBounds: function(pmbr) {},

        /**
         * 目标地理位置是否在包络框范围内
         * @param  {EzCoord} coord - 目标地理位置坐标
         * @return {Boolean}  是否在包络框范围内
         */
        containsPoint: function(coord) {},

        /**
         * 返回对角线坐标序列
         * @return {String}
         */
        toBBoxString: function() {}
    };
