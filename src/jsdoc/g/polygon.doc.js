/**
 * 多边形叠加要素类
 * @constructor
 * @param {EzCoord|Number[]|String} coord - 地理坐标
 * @param {Object} [style_opts] - 样式参数设置
 * @param {String} style_opts.fillColor - 填充颜色
 * @param {Number} style_opts.fillOpacity - 填充颜色透明度
 * @param {String} style_opts.strokeColor - 描边颜色
 * @param {Number} style_opts.strokeOpacity - 描边颜色透明度
 * @param {Number} style_opts.strokeWidth - 描边宽度
 * @param {Number[]} style_opts.strokeLineDash - 线型样式,参考{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray}
 * @extends {EzOverlay}
 */
var Polygon = function(coord, style_opts) {};

Polygon.prototype =
    /** @lends Ez.g.Polygon.prototype */
    {
        /**
         * 获取要素的外包络框中心坐标
         * @return {EzCoord}
         */
        getCenter: function() {},

        /**
         * 获取多边形要素的所有顶点坐标, 注意数组为多维数组，多边形可能为复杂多边形类型
         * @return {Number[]}
         */
        getPoints: function() {}
    };
