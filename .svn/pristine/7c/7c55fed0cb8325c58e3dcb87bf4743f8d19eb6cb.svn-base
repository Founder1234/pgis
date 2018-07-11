/*
|---------------------------------- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
|
Ez.TileLayer.GD                
|
|@author: hemingxiao
|@date: 2017-01-04
|@descript: 高德瓦片服务图层构建类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.GD');

goog.require('Ez.TileLayer.Base');

/**
 * 高德服务瓦片图层构建类
 * @param {String} name        图层名
 * @param {String} url         url模板
 * @param {Object} opt_options 图层配置参数
 */
Ez.TileLayer.GD = function (name, url, opt_options) {

    var opts = opt_options ? opt_options : {};

    this.url_ = url;
    var urlTemplate = url + '&x={x}&y={y}&z={z}';

    /**
     * 定义数据源
     */
    var source = new ol.source.XYZ({
        url: urlTemplate,
        crossOrigin: opts.crossOrigin,
        wrapX: goog.isDef(opts.wrapX) ? opts.wrapX : true,
        cacheSize: opts.cacheSize ? opts.cacheSize : 2048,
        tileLoadFunction: opts.tileLoadFunction ? opts.tileLoadFunction : undefined,
        projection: 'EPSG:3857',
        /* tileUrlFunction: function (tileCoord, pixelRatio, projection) {
            var z = tileCoord[0];
            var x = tileCoord[1];
            var y = tileCoord[2];

            return urlTemplate.replace('{z}', z.toString())
                .replace('{y}', y.toString())
                .replace('{x}', x.toString());
            return url;
        } */
    });
    /* var resolutions = [
        156543.0339,
        78271.516953125,
        39135.7584765625,
        19567.87923828125,
        9783.939619140625,
        4891.9698095703125,
        2445.9849047851562,
        1222.9924523925781,
        611.4962261962891,
        305.74811309814453,
        152.87405654907226,
        76.43702827453613,
        38.218514137268066,
        19.109257068634033,
        9.554628534317016,
        4.777314267158508,
        2.388657133579254,
        1.194328566789627,
        0.5971642833948135,
    ];
    source['tileGrid'] = new ol.tilegrid.TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
        tileSize: 256
    }); */

    var tileOptions = Object.assign({}, opts, { source: source });

    goog.base(this, name, tileOptions);
};
goog.inherits(Ez.TileLayer.GD, Ez.TileLayer.Base);


/**
 * 获取瓦片的服务地址
 * @return {String} URL地址
 */
Ez.TileLayer.GD.prototype.getUrl = function () {
    return this.url_;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerGD', Ez.TileLayer.GD);
