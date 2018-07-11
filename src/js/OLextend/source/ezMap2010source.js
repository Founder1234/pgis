/*
/-----------------------------------------------------------------------------------  
/           OL3扩展类，针对公司EzMap2010格式地图数据源调用
/-----------------------------------------------------------------------------------
*/

goog.provide('ol.source.EzMap2010');

goog.require('ol.source.TileImage');
goog.require('ol.TileUrlFunction');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.proj');
goog.require('ol.proj.Projection');
goog.require('ol.TileCoord');


/**
 * EzMap2010地图数据源类
 * @param {olx.source.EzMap2010Options} opt_options [description]
 * @extends {ol.source.TileImage}
 * @constructor
 */
ol.source.EzMap2010 = function(opt_options) {
    /** EzMap2010格式的参考标准 */
    var projection = opt_options.projection || 'EPSG:4326';

    /** EzMap2010格式分辨率计算方法,9级地图一张瓦片对应1度 */
    var resolutions = new Array(30);
    for (var z = 0; z <= 30; ++z) {
        resolutions[z] = Math.pow(2, (1 - z));
    }

    var sourceOptions = {};
    sourceOptions['tileGrid'] = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: opt_options.resolutions || resolutions,
        tileSize: 256
    });
    sourceOptions['projection'] = projection;
    sourceOptions['tileUrlFunction'] = this.urlCallbackFunction_.bind(this);

    goog.asserts.assert(goog.isDef(opt_options.url), '瓦片URL模板不能为空');

    /**
     * @type {string}
     * @private
     */
    this.urlTemplate_ = opt_options.url;

    goog.base(this, sourceOptions);
};
goog.inherits(ol.source.EzMap2010, ol.source.TileImage);


/**
 * 处理瓦片行列号，用来返回瓦片的URL
 * 
 * @param  {ol.TileCoord} tileCoord  [description]
 * @param  {number|undefined} pixelRatio [description]
 * @param  {ol.proj.ProjectionLike} projection [description]
 * @return {string}            [description]
 */
ol.source.EzMap2010.prototype.urlCallbackFunction_ = function(tileCoord, pixelRatio, projection) {
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = tileCoord[2];

    var tileurl = this.urlTemplate_;
    return tileurl.replace('{z}', z.toString())
        .replace('{y}', y.toString())
        .replace('{x}', x.toString());
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('ol.source.EzMap2010', ol.source.EzMap2010);
