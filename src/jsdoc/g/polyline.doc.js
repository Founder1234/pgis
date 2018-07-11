/**
 * 多义线叠加要素类
 * @constructor
 * @param {String|Number[]} coord - 地理坐标,'x1,y1,x2,y2,x3,y3,x4,y4'
 * @param {Object} [style_opts] - 样式参数设置
 * @param {String} style_opts.strokeColor - 描边颜色
 * @param {Number} style_opts.strokeOpacity - 描边颜色透明度
 * @param {Number} style_opts.strokeWidth - 描边宽度
 * @param {Number[]} style_opts.strokeLineDash - 线型样式,参考{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray}
 * @extends {EzOverlay}
 */
var Polyline = function() {};

Polyline.prototype =
    /** @lends Ez.g.Polyline.prototype */
    {
        /**
         * 获取要素外包络框中心坐标
         * @return {EzCoord}
         */
        getCenter: function() {},

        /**
         * 获取多义线的顶点坐标数据集
         * @return {Number[]} 二维坐标数组
         */
        getPoints: function() {},

        /**
         * 获取多义线的第一个顶点坐标
         * @return {EzCoord} 地理坐标对象
         */
        getFirstPoint: function() {},

        /**
         * 在多义线的末顶点增加一个简易的箭头对象
         */
        addArrowHead: function() {},

        /**
         * 在多义线的末顶点移除一个已经增加的简易箭头对象
         */
        removeArrowHead: function() {},

        /**
         * 获取箭头的三个顶点坐标值
         * @return {String} 坐标系列
         */
        getArrowHeadPositions: function() {}
    };
