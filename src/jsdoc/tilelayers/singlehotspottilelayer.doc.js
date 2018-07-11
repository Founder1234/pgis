/**
 * 基于矢量绘制的热点图层类
 * @example
 *  var singleTile = new EzTileLayerSingleHotSpot({
        proxyurl: "http://172.18.70.33:7878/proxy",
        url: "http://172.25.16.146:8080/EzPOISearchS/PoiWMTSV1?scope=_NAMES&layer=PGIS_CS_HDCS_DH_PG&keywords=&style=default&tilematrixset=d&Service=WMTS&Request=GetTile&Version=1.0.0&Format=jsonv1&TileMatrix={z}&TileCol={x}&TileRow={y}",
        icon: new EzIcon({
            src: '../images/hot1.png',
            anchor: [0.5, 1],
            size: [16, 16],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            opacity: 1
        }),
        type: 'jsonv1',
        isScale: true,
        scaleFactor: 0.5
    });
    map.addLayer(singleTile);
    ...
    
 * @constructor
 * @param {Object} options 热点配置参数
 * @param {String} options.proxyurl 代理服务器地址
 * @param {String} [options.proxyJoin="?toUrl="] 代理服务拼接字符串
 * @param {String} options.url 热点数据发布服务地址
 * @param {String} options.type 热点数据格式,必须与url中的参数匹配,如:'jsonv1'
 * @param {EzIcon} options.icon 绘制的marker图标样式
 * @param {Boolean} options.isScale 是否对热点进行聚合显示
 * @param {Number} [options.scaleFactor=1] 热点的图片显示比例
 * @extends {olClass.Vector}
 */
var EzTileLayerSingleHotSpot = function(options) {};
