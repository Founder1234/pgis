/**
 * 天地图瓦片地图实现类，用于加载天地图类型的地图
 * @constructor
 * @param {String} name        瓦片的图层名，唯一
 * @param {String} url         瓦片地图服务地址
 * @param {Object} options     瓦片的配置参数(后续用于扩展)
 * @extends {EzTileLayerBase}
 */
var EzTileLayerTDT = function(name, url, options) {};

EzTileLayerTDT.prototype =
    /** @lends EzTileLayerTDT.prototype */
    {
        /**
         * 获取瓦片地图服务地址
         * @return {String} url
         */
        getUrl: function() {}
    };
