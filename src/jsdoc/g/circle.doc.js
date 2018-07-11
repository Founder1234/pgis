/**
 * 圆叠加要素类
 * @constructor
 * @param {EzCoord|Number[]|String} coord - 地理坐标
 * @param {Number} radius - 圆半径,单位: m
 * @param {Object} [style_opts] - 样式参数设置
 * @param {String} style_opts.fillColor - 填充颜色
 * @param {Number} style_opts.fillOpacity - 填充颜色透明度
 * @param {String} style_opts.strokeColor - 描边颜色
 * @param {Number} style_opts.strokeOpacity - 描边颜色透明度
 * @param {Number} style_opts.strokeWidth - 描边宽度
 * @extends {EzOverlay}
 */
var Circle = function(coord, radius, style_opts) {};

Circle.prototype =
    /** @lends Ez.g.Circle.prototype */
    {
        /**
         * 获取圆要素的半径
         * @return {Number} 半径,单位为m
         */
        getRadius: function() {},

        /**
         * 设置圆的新半径，单位为M
         * @param {Number} number 半径,单位为m
         */
        setRadius: function(number) {},

        /**
         * 设置圆的新中心位置
         * @param {EzCoord} coords 地理坐标
         */
        setCenter: function(coords) {},

        /**
         * 获取圆的中心坐标
         * @return {EzCoord}
         */
        getCenter: function() {}
    };
