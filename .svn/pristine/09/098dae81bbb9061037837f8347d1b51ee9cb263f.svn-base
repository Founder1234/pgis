/*
|------------------------------------------------------------------------------
|							 ol.source.HotSpot2		
|
|@author: qianleyi
|@date: 2016-04-05
|@descript: 热点图层数据源,支持多源热点数据管理
|------------------------------------------------------------------------------
*/
goog.provide('ol.source.HotSpot2');
goog.provide('ol.HotSpotEvent');

goog.require('ol.source.TileImage');

ol.HotSpotEvent = function(type, zIndex) {
    goog.base(this, type);
    this.zIndex = zIndex;
};
goog.inherits(ol.HotSpotEvent, ol.events.Event);

/**
 * 多源热点数据源管理类
 *
 * @constructor
 * @param {options} options
 * @extends {ol.source.TileImage}
 */
ol.source.HotSpot2 = function(options) {

    var opts = options || {};

    /** @type {String} 投影参考 */
    var projection_ = opts.projection ? opts.projection : 'EPSG:4326';
    /** @type {Number} 瓦片大小 */
    var tileSize_ = opts.tileSize ? opts.tileSize : 256;

    var projectionExtent_ = ol.proj.get(projection_).getExtent();

    var maxResolution = 360 / tileSize_;
    var resolutions_ = new Array(18);
    for (var z = 0; z < 18; ++z) {
        resolutions_[z] = maxResolution / Math.pow(2, z);
    }

    var defaultTileGrid = new ol.tilegrid.TileGrid({
        origin: ol.extent.getTopLeft(projectionExtent_),
        resolutions: resolutions_,
        tileSize: tileSize_
    });

    var tileGrid_ = opts.tileGrid ? opts.tileGrid : defaultTileGrid;
    var urlCallbackFunction = this.urlCallbackFunction_.bind(this);

    goog.base(this, {
        projection: projection_,
        tileUrlFunction: urlCallbackFunction,
        tileGrid: tileGrid_
    });

    /** 处理多源URL */
    /**
     * dataGroup包括：
     * @type {Object}
     * @type {String} dataGroup.name - 表示热点数据源名,唯一
     * @type {String} dataGroup.url - 表示热点的地址,XYZ格式
     * @type {Ez.Icon} dataGroup.icon - 表示热点的样式定义
     */
    this.sources_ = opts.dataGroup ? opts.dataGroup : [];

    this.proxyUrl_ = opts.proxyUrl ? opts.proxyUrl : '';

    this.proxyJoinString_ = opts.proxyJoin ? opts.proxyJoin : '?request=gotourl&url=';

    this.markerStatus_ = {};
};
goog.inherits(ol.source.HotSpot2, ol.source.TileImage);

/**
 * 回调函数用于处理当前窗口内请求的瓦片地址
 * @return {[type]} [description]
 */
ol.source.HotSpot2.prototype.urlCallbackFunction_ = function(tileCoord, pixelRatio, projection) {
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = -tileCoord[2] - 1;

    var dataArr = this.markerStatus_;

    var tempUrls = this.sources_.map(function(val) {
        var hotspoturl = val.url.replace(/{z}/g, z.toString())
            .replace(/{y}/g, y.toString())
            .replace(/{x}/g, x.toString());

        if (!(z in dataArr)) dataArr[z] = {};
        if (!((x + ":" + y) in dataArr[z])) dataArr[z][x + ":" + y] = {};

        dataArr[z][x + ":" + y][val.name] = {
            icon: val.icon,
            iconInteraction: val.iconInteraction,
            isVisual: true //后续想想控制的机制
        };

        return {
            name: val.name,
            url: this.proxyUrl_ + this.proxyJoinString_ + encodeURIComponent(hotspoturl)
        }
    }, this);

    /** 使用axios方式处理AJAX */
    tempUrls.map(function(val) {
        if (this.markerStatus_[z][x + ":" + y][val.name]['data']) {
            this.dispatchEvent(new ol.HotSpotEvent('updateRender', z));
            return;
        }

        axios.get(val.url)
            .then(ajaxCallback.bind(this, val.name, z, x + ":" + y));

        function ajaxCallback(name, z, xy, response) {
            var res = response.data.replace(/((\r\n)+)$/, "").replace(/\r\n/g, ",").replace(/(.\d+)$/, "");
            res = "[" + res + "]";
            dataArr[z][xy][name]['data'] = JSON.parse(res);
            this.dispatchEvent(new ol.HotSpotEvent('updateRender', z));
        }
    }, this);
};

/**
 * 获取热点数据
 * @return {json} json对象，格式: zoom/x/y => values
 */
ol.source.HotSpot2.prototype.getMarkerData = function() {
    return this.markerStatus_;
};
