/**
 * EzTitle地图叠加类
 * @constructor
 * @param {String} title - 标题内容
 * @param {Object} [options] - 标题样式设置
 * @param {String} options.font - 字体类型,参考CSS:font-family
 * @param {Number} options.fontSize - 字体大小
 * @param {String} options.fontColor - 字体颜色:支持:hex,rgb,rgba三种格式
 * @param {String} options.fillColor - 背景颜色:支持:hex,rgb,rgba三种格式
 * @param {Boolean} options.isStroke=false - Title对象是否描边
 * @param {String} options.strokeColor - 描边颜色:支持:hex,rgb,rgba三种格式
 * @param {Number} options.strokeWidth - 描边边框宽度
 * @param {Number[]} options.strokeStyle - 线型样式,参考{@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray}
 * @param {String} options.textAlign - 文本对齐方式,参考CSS中canvas的Text设置,默认为'center'
 * @param {String} options.textBaseline - 文本水平对齐方向参考线,参考CSS中canvas的Text设置,默认为'middle'
 * @param {Number} options.paddingV - title文本距离外边框的垂直差距,仅一个方向量-已经废弃，用lineHeight替代
 * @param {Number} options.lineHeight - title文本行高
 * @param {Number} options.paddingH - title文本距离外边框的水平差距,仅一个方向量
 * @param {String} options.positioning - 外包框的定位方式,默认为'left-top',建议不要设置该选项
 * @param {Number[]} [options.anchor=[0.5,1]] - title文本锚点
 * @param {Number[]} [options.offset=[0,0]]  - title文本距离定位点的偏移量
 * @extends {olClass.Overlay}
 */
var EzTitle = function(title, options) {};

EzTitle.prototype =
    /** @lends EzTitle.prototype */
    {
        /**
         * 获取Title对象的标题内容
         * @return {String} 标题内容
         */
        getTitle: function() {},

        /**
         * 设置标题对象的地理位置
         * @param {EzCoord|Number[]} coord - 地理坐标
         */
        setPosition: function(coord) {},

        /**
         * 设置标题对象的偏移量
         * @param {Number[]} offset - 偏移数组
         */
        setOffset: function(offset) {},

        /**
         * 显示Title
         */
        show: function() {},

        /**
         * 隐藏Title
         */
        hide: function() {}
    };
