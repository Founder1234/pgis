// FIXME 增加对热点数据的支持数据源 ol.source.EzHotspot

goog.provide('ol.source.EzHotspot');

goog.require('ol.source.TileImage');
goog.require('ol.TileUrlFunction');

/**
 * @classdesc
 * 热点数据源声明类
 *
 * @constructor
 * @extends {ol.source.TileImage}
 * @param {olx.source.XYZOptions} [options] 热点数据源定义源类
 */
ol.source.EzHotspot = function(options) {
    var projection = goog.isDef(options.projection) ? options.projection : 'EPSG:4326';

    var projectionExtent_ = ol.proj.get(projection).getExtent();
    var tileSize_ = goog.isDef(options.tileSize) ? options.tileSize : 256;

    var maxResolution = 360 / tileSize_;
    var resolutions = new Array(18);
    for (var z = 0; z < 18; ++z) {
        resolutions[z] = maxResolution / Math.pow(2, z);
    }
    var resolutions_ = goog.isDef(options.resolutions) ? options.resolutions : resolutions;

    var tileGrid = new ol.tilegrid.TileGrid({
        origin: ol.extent.getTopLeft(projectionExtent_),
        resolutions: resolutions_,
        tileSize: tileSize_
    });

    goog.base(this, {
        projection: projection,
        tileUrlFunction: this.urlCallbackFunction_,
        tileGrid: tileGrid
    });

    goog.asserts.assert(goog.isDef(options.hotspotUrlTemplate), '热点数据URL模板不能为空');
    this.hotspotUrlTemplate_ = options.hotspotUrlTemplate;
    goog.asserts.assert(goog.isDef(options.tileUrlTemplate), '热点数据URL模板不能为空');
    this.tileUrlTemplate_ = options.tileUrlTemplate;

    this.markerData_ = {};
    this.proxyUrl_ = goog.isDef(options.proxyUrl) ? options.proxyUrl + '?request=gotourl&url=' : '';
};
goog.inherits(ol.source.EzHotspot, ol.source.TileImage);


/**
 * 用来返回瓦片的URL，同时发送AJAX请求
 * @param {tileCoord} tileCoord  瓦片坐标
 * @param {pixelRatio} pixelRatio 比例
 * @param {projection} projection 投影
 */
ol.source.EzHotspot.prototype.urlCallbackFunction_ = function(tileCoord, pixelRatio, projection) {
    var z = tileCoord[0];
    var x = tileCoord[1];
    var y = -tileCoord[2] - 1;

    var hotspoturl = this.hotspotUrlTemplate_;
    var tileurl = this.tileUrlTemplate_;
    var hotspoturl = hotspoturl.replace(/{z}/g, z.toString())
        .replace(/{y}/g, y.toString())
        .replace(/{x}/g, x.toString());

    var dataArr = this.markerData_;
    var source = this;
    var xhr = this.createXHR();

    /** AJAX 回调函数 */
    var callback = function(e) {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        // all is well  
        if (xhr.readyState === 4) {
            var res = xhr.responseText.replace(/((\r\n)+)$/, "").replace(/\r\n/g, ",").replace(/(.\d+)$/, "");
            res = "[" + res + "]";
            if (z in dataArr) {
                dataArr[z][x + ":" + y] = JSON.parse(res);
            } else {
                dataArr[z] = {};
                dataArr[z][x + ":" + y] = JSON.parse(res);
            }
        }
    };

    xhr.onreadystatechange = callback;
    xhr.open("GET", this.proxyUrl_ + encodeURIComponent(hotspoturl), true);
    xhr.send(null);

    return tileurl.replace('{z}', z.toString())
        .replace('{y}', y.toString())
        .replace('{x}', x.toString());
};

/** 使用native方式处理AJAX */
ol.source.EzHotspot.prototype.createXHR = function() {

    var xhr;
    if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ]

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            } catch (e) { new Error("查看浏览器版本"); }
        }
    }
    return xhr;
};


/**
 * 获取热点数据
 * @return {json} json对象，格式: zoom/x/y => values
 */
ol.source.EzHotspot.prototype.getMarkerData = function() {
    return this.markerData_;
};
