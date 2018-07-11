/**
 * 瓦片地图实现类，用于加载支持XYZ格式服务地址的地图
 * @constructor
 * @param {String} name    瓦片的图层名，唯一
 * @param {String} url     瓦片地图服务地址
 * @param {Object} options 瓦片的配置参数
 * @param {String} [options.projection="EPSG:3857"] 图层的地图参考
 * @param {Number} [options.tileSize=256] 图层的瓦片大小
 * @extends {EzTileLayerBase}
 */
var EzTileLayerXYZ = function(name, url, options) {};

EzTileLayerXYZ.prototype =
    /** @lends EzTileLayerXYZ.prototype */
    {
        /**
         * 获取瓦片地图服务地址
         * @return {String} url
         */
        getUrl: function() {}
    };
