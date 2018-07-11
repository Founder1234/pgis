/*
|------------------------------------------------------------------------------
|                               ol.source.SingleHotSpot             
|   
|@author: qianleyi 
|@date: 2016-05-11
|@descript: 单热点图层数据源类，负责AJAX请求数据，管理数据
|------------------------------------------------------------------------------
*/
goog.provide('ol.source.SingleHotSpot');

// goog.require('ol.source.VectorTile');


/** 单个热点图层数据源类
 * @constructor
 * @param {Object} options
 * @extends {ol.source.VectorTile}
 */
ol.source.SingleHotSpot = function (options) {

    if (!options.url) {
        return;
    }

    this.proxyType = options.proxyType;

    this.url = options.url;

    this.proxyurl = options.proxyurl;

    this.appkey = options.appkey;

    this.proxyurlJoin = options.proxyJoin || "?toUrl=";

    var type = options.type;
    var icon = options.icon;
    var isScale = options.isScale;
    var scaleFactor = options.scaleFactor;
    var format = options.format || 'scale';

    if (format === 'cluster') {
        var clusterStyle = options.clusterStyle;
        // 聚合图标集以及分类关键字
        var icongroup = options.clusterIconGroup;
        var clusterKeyName = options.clusterKeyName;
        this.format = new ol.format.HotSpotCluster(type, icon, clusterStyle, icongroup, clusterKeyName);
    } else {
        this.format = new ol.format.HotSpot(type, icon, isScale, scaleFactor);
    }


    var maxRes = 360 / 256;
    var resolutions = new Array(22);
    for (var z = 0; z <= 22; ++z) {
        resolutions[z] = maxRes / Math.pow(2, z);
    }

    var tilegrid = this.tilegrid = new ol.tilegrid.TileGrid({
        origin: options.origin || [-180, 90],
        resolutions: options.resolutions || resolutions,
        tileSize: options.tileSize || 256
    });

    goog.base(this, {
        projection: options.projection || 'EPSG:4326',
        tileGrid: tilegrid,
        url: this.tileurlfunc.bind(this),
        // loader: this.xhr(this.tileurlfunc.bind(this), this.format),
        strategy: ol.loadingstrategy.tile(tilegrid),
        format: this.format
    });

    this.lasttime_ = null;

    this.loading_ = false;

    this.loadend_ = true;
};
goog.inherits(ol.source.SingleHotSpot, ol.source.Vector);

ol.source.SingleHotSpot.prototype.setLoadingState = function (state) {
    this.loading_ = state;
};

ol.source.SingleHotSpot.prototype.setLoadendState = function (state) {
    this.loadend_ = state;
};

ol.source.SingleHotSpot.prototype.tileurlfunc = function (extent, resolution) {

    var tileCoord = this.tilegrid.getTileCoordForCoordAndResolution(
        ol.extent.getCenter(extent), resolution);
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = -tileCoord[2] - 1;

    var tileurl = this.url;
    var changeurl = tileurl.replace('{z}', z.toString())
        .replace('{y}', y.toString())
        .replace('{x}', x.toString());

    // return this.proxyurl + this.proxyurlJoin + encodeURIComponent(changeurl) + '&appkey=' + this.appkey;
    if (this.proxyType == 'POST') {
        var array = changeurl.split("?");
        var obj = {
            url: array[0],
        };
        /* var items = array[1].split("&");
        var content = {};
        for (var i = 0; i < items.length; i++) {
            var item = items[i].split("=");
            if (item[0]) {
                content[item[0]] = item[1] || '';
            }
        } */
        obj.content = array[1];
        obj.proxyurl = this.proxyurl;
        obj.proxyType = this.proxyType;
        return obj;
    } else {
        return this.proxyurl + this.proxyurlJoin + encodeURIComponent(changeurl + '&appkey=' + this.appkey);
    }
};

/**
 * @param {ol.Extent} extent Extent.
 * @param {number} resolution Resolution.
 * @param {ol.proj.Projection} projection Projection.
 */
ol.source.SingleHotSpot.prototype.loadFeatures = function (
    extent, resolution, projection) {
    var loadedExtentsRtree = this.loadedExtentsRtree_;
    var extentsToLoad = this.strategy_(extent, resolution);
    var i, ii;
    for (i = 0, ii = extentsToLoad.length; i < ii; ++i) {
        var extentToLoad = extentsToLoad[i];
        var alreadyLoaded = loadedExtentsRtree.forEachInExtent(extentToLoad,
            /**
             * @param {{extent: ol.Extent}} object Object.
             * @return {boolean} Contains.
             */
            function (object) {
                return ol.extent.containsExtent(object.extent, extentToLoad);
            });
        if (!alreadyLoaded) {
            if (!this.loading_ && this.loadend_) {
                this.loader_.call(this, extentToLoad, resolution, projection);
                loadedExtentsRtree.insert(extentToLoad, { extent: extentToLoad.slice() });
            }
        }
    }
};
