/**
 * 图层组类
 * @constructor
 * @param {Object} options 图层组配置参数
 * @param {Number} [options.opacity=1] 图层组透明度
 * @param {Ez.TileLayer.Base[]} [options.layers=[]] 图层元素
 * @extends {olClass.Group}
 */
var EzLayerGroup = function(options) {};

EzLayerGroup.prototype =
    /** @lends EzLayerGroup.prototype */
    {
        /**
         * 增加图层到图层组中，并显示在地图上
         * @param  {EzTileLayerBase} layer
         */
        push: function(layer) {},

        /**
         * 删除图层组中的具体某个图层
         * @param  {EzTileLayerBase} layer
         */
        remove: function(layer) {},

        /**
         * 显示图层组
         */
        show: function() {},

        /**
         * 隐藏图层组
         */
        hide: function() {}
    };
