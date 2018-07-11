/**
 * 地图叠加要素基类,建议不要直接new该类
 * @constructor
 * @param {Object} options - 基础地图叠加类参数设置
 * @extends {olClass.Feature}
 */
var EzOverlay = function(options) {};

/**
 * 读取GeoJson数据
 * @param  {Object} geojson
 * @return {Number[]} 
 */
EzOverlay.prototype.readGeoJSON = function(geojson) {};

EzOverlay.prototype =
    /** @lends EzOverlay.prototype */
    {
        /**
         * 获取叠加要素的包络框
         * @return {EzMBR} 地理包络框
         */
        getMBR: function() {},

        /**
         * 获取填充颜色值
         * @return {String} 颜色字符序列.'rgb(-,-,-)','rgba(-,-,-,-)','hex'
         */
        getFillColor: function() {},

        /**
         * 获取填充颜色透明度
         * @return {Number} 透明度
         */
        getFillOpacity: function() {},

        /**
         * 设置叠加要素的填充颜色
         * @param {String} colorString - 颜色字符序列.'rgb(-,-,-)','rgba(-,-,-,-)','hex'
         */
        setFillColor: function(colorString) {},

        /**
         * 设置填充颜色透明度
         * @param {Number} opacity - 颜色透明度
         */
        setFillOpacity: function(opacity) {},

        /**
         * 获取叠加要素描边颜色
         * @return {String} 颜色字符序列.'rgb(-,-,-)','rgba(-,-,-,-)','hex'
         */
        getStrokeColor: function() {},

        /**
         * 获取叠加要素描边宽度
         * @return {Number} 描边宽度
         */
        getStrokeWidth: function() {},

        /**
         * 获取叠加要素描边颜色透明度
         * @return {Number} 描边颜色透明度
         */
        getStrokeOpacity: function() {},

        /**
         * 设置叠加要素描边颜色
         * @param {String} colorString - 颜色字符序列.'rgb(-,-,-)','rgba(-,-,-,-)','hex'
         */
        setStrokeColor: function(colorString) {},

        /**
         * 设置叠加要素描边宽度
         * @param {Number} width - 描边宽度
         */
        setStrokeWidth: function(width) {},

        /**
         * 设置叠加要素描边颜色透明度
         * @param {Number} opacity - 描边颜色透明度
         */
        setStrokeOpacity: function(opacity) {},

        /**
         * 显示当前要素
         */
        show: function() {},

        /**
         * 隐藏当前要素
         */
        hide: function() {},

        /**
         * 通过Overlay对象打开一个POPUP
         * @param  {String} strHTML - HTML内容字符序列化
         * @param  {EzCoord|Number[]} coord - 地理坐标
         * @param  {Object} [options] - 设置POPUP参数
         * @param  {String} options.customStyle - POPUP的最外层CSSClass,用户可以根据需要自定义POPUP样式
         */
        openInfoWindow: function(strHTML, coord, options) {},

        /**
         * 关闭由overlay对象打开的POPUP
         */
        closeInfoWindow: function() {},

        /**
         * 获取要素的外包络框
         * @return {EzMBR}
         */
        getBounds: function() {},

        /**
         * 要素闪烁显示
         * @param  {Object} options 相关配置参数
         * @param  {Number} options.duration 持续时间
         * @param  {Number} options.times 闪烁次数
         */
        flash: function(options) {},

        /**
         * 将要素转化为GeoJSON格式
         * @return {String} GeoJSON对象序列
         */
        toGeoJSON: function() {}
    };
