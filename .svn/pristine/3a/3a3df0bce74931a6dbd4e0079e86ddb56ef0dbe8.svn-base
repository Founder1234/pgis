/**
 * 点叠加要素类
 * @constructor
 * @param {EzCoord|Number[]|String} coord - 地理坐标
 * @param {Object} [style_opts] - 样式参数设置
 * @param {String} style_opts.fillColor - 填充颜色
 * @param {Number} style_opts.fillOpacity - 填充颜色透明度
 * @param {String} style_opts.strokeColor - 描边颜色
 * @param {Number} style_opts.strokeOpacity - 描边颜色透明度
 * @param {Number} style_opts.radius - 点样式半径,单位像素
 * @param {Number} style_opts.strokeWidth - 描边宽度
 * @extends {EzOverlay}
 */
var Point = function(coord, style_opts) {};

Point.prototype =
    /** @lends Ez.g.Point.prototype */
    {
        /**
         * 获取点要素的像素半径
         * @return {Number} 像素半径
         */
        getRadius: function() {},

        /**
         * 更新点要素的像素半径
         * @param {Number} rad
         */
        setRadius: function(rad) {},

        /**
         * 获取要素的地理坐标
         * @return {EzCoord} EzCoord地理坐标对象
         */
        getCenter: function() {},

        /**
         * 更新点的中心坐标值
         * @param {EzCoord} coords 坐标对象
         */
        setCenter: function(coord) {}
    };
