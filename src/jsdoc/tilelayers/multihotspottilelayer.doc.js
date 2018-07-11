/**
 * 基于矢量绘制的热点图层管理器
 * @example
 * var singlehotspot1 = new EzTileLayerSingleHotSpot(...);
 * var singlehotspot2 = new EzTileLayerSingleHotSpot(...);
 * var multiLayers = new EzTileLayerMultiHotSpot({
 *      layers: [singlehotspot1, singlehotspot2]
 * });
 * map.addLayer(multiLayers);
 * 
 * @constructor
 * @param {Object} options 配置参数
 * @param {EzTileLayerSingleHotSpot[]} options.layers 图层组
 * @extends {EzLayerGroup}
 */
var EzTileLayerMultiHotSpot = function(options) {};

EzTileLayerMultiHotSpot.prototype =
    /** @lends EzTileLayerMultiHotSpot.prototype */
    {
        /**
         * 增加单个热点图层到集合中
         * @param {EzTileLayerSingleHotSpot} layer 基于矢量绘制的热点图层
         */
        addSingleLayer: function(layer) {},

        /**
         * 删除单个热点图层
         * @param {EzTileLayerSingleHotSpot} 基于矢量绘制的热点图层
         */
        deleteSingleLayer: function(layer) {}
    };
