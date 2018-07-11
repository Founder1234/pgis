/*
|------------------------------------------------------------------------------
|								Ez.TileLayer.HotSpot				
|
|@author: qianleyi
|@date: 2016-06-24(重构)
|@descript: 老热点技术，使用image+单marker实现热点图层
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.HotSpot');

goog.require('ol.layer.Tile');
goog.require('Ez.Marker');
goog.require('Ez.Coordinate');
goog.require('ol.source.EzHotspot');

/**
 * 承载热点数据源，用来加载在Map上的瓦片图层
 * @constructor
 * @extends {ol.layer.Tile}
 * @param {json} [options] 定义图层的参数
 *
 * @namespace Ez.TileLayer
 */
Ez.TileLayer.HotSpot = function(options) {
    /** @type {Object} 热点数据源对象参数*/
    var opt_source_ = {};
    /** @type {Object} 热点交互marker对象参数*/
    var opt_marker_ = {};

    var icon;
    for (var index in options) {
        if (index === "icon") {
            icon = options[index];
        } else {
            opt_source_[index] = options[index];
        }
    }

    //opt_source_['crossOrigin'] = "anonymous";

    goog.base(this, {
        source: new ol.source.EzHotspot(opt_source_)
    });

    this.set('layerType', 'hotspotLayer');
    this.markerOpacity_ = goog.isDef(opt_marker_['opacity']) ? opt_marker_['opacity'] : 1;
    opt_marker_['opacity'] = 0;
    this.popupAnchor_ = goog.isDef(options.popupAnchor) ? options.popupAnchor : [0, 0];
    this.marker_ = new Ez.Marker(new Ez.Coordinate(0, 0), icon);
};
goog.inherits(Ez.TileLayer.HotSpot, ol.layer.Tile);

/**
 * 给图层增加map属性，并提供其他操作
 * @param {Ez.Map} map Ez.Map 对象
 */
Ez.TileLayer.HotSpot.prototype.onAdd = function(map) {
    this.map_ = map;

    map.addOverlay(this.marker_);
    var layerGroups = map.getLayers();
    layerGroups.insertAt(1, this);
    //map.on('pointermove', this.onMouseMove_);
    //this.marker_.addListener(Ez.Event.MAP_CLICK,this.onClick_);
};

/**
 * 给图层增加map属性，并提供其他操作
 * @param {Ez.Map} map Ez.Map 对象
 */
Ez.TileLayer.HotSpot.prototype.onRemove = function(map) {
    this.map_ = null;

    var hotspotLayer = this;
    map.removeLayer(hotspotLayer, true);

    //map.un('pointermove', this.onMouseMove_);
    //this.marker_.un(Ez.Event.MAP_CLICK,this.onClick_);

    map.removeOverlay(this.marker_);
};


/**
 * 添加鼠标移动事件处理函数
 * @param  {ol.MapBrowserEvent} evt ol.MapBrowserEvent事件对象
 */
Ez.TileLayer.HotSpot.prototype.onMouseMove_ = function(evt) {
    var mouseCoordinate = evt.coordinate;
    var frameState = evt.frameState;
    var resolution = frameState.viewState.resolution;
    var degreeOf6pixel = resolution * 8;
    var projection = frameState.viewState.projection;
    var zoom = evt.map.getView().getZoom();

    var tileLayer, tileSource, tileGrid;
    evt.map.getLayers().forEach(function(layer) {
        if (layer instanceof Ez.TileLayer.HotSpot) {
            tileLayer = layer;
            tileSource = layer.getSource();
            tileGrid = tileSource.getTileGridForProjection(projection);
        } else {
            return;
        }
    });

    var extent = frameState.extent;
    var topLeft = ol.extent.getTopLeft(extent);
    ol.extent.createOrUpdate(topLeft[0], topLeft[1], mouseCoordinate[0], mouseCoordinate[1], extent);

    var mouseRange = tileGrid.getTileRangeForExtentAndResolution(extent, resolution);

    var bottomRight = mouseRange.maxX + ":" + (-mouseRange.maxY - 1);
    var markerData_ = tileSource.getMarkerData();

    if (zoom in markerData_) {
        if (bottomRight in markerData_[zoom]) {
            var hotspotArr = markerData_[zoom][bottomRight];
            var len = hotspotArr.length;

            for (var i = 0; i < len; i++) {
                var hotspotLatLng = new Ez.Coordinate(parseFloat(hotspotArr[i].X), parseFloat(hotspotArr[i].Y));
                var hotspotbounds = new Ez.MBR(hotspotLatLng.coordinate_[0] - degreeOf6pixel, hotspotLatLng.coordinate_[1] - degreeOf6pixel, hotspotLatLng.coordinate_[0] + degreeOf6pixel, hotspotLatLng.coordinate_[1] + degreeOf6pixel);

                var data = {
                    'ID': hotspotArr[i].ID,
                    'LABEL': hotspotArr[i].LABEL,
                    'X': hotspotArr[i].X,
                    'Y': hotspotArr[i].Y
                };

                if (hotspotbounds.containsPoint(mouseCoordinate)) {
                    evt.map.getViewport().style.cursor = 'pointer';
                    tileLayer.marker_.setPoint(hotspotLatLng);
                    tileLayer.marker_.set('hotspotdata', data);
                    tileLayer.marker_.setOpacity(tileLayer.markerOpacity_);
                    break;
                }

                evt.map.getViewport().style.cursor = '';
                tileLayer.marker_.setOpacity(0);
            }
        }
    }
};


/**
 * Marker热点点击事件处理函数
 * @param  {ol.MapBrowserEvent} evt ol.MapBrowserEvent事件对象
 */
Ez.TileLayer.HotSpot.prototype.onClick_ = function(data) {
    if (data) {
        var markerData = data.get('data');
        var content = 'LABLE' + ' : ' + markerData.LABEL;
        if (data.popupOpenFlag_) {
            data.closeInfoWindowHtml();
        } else {
            data.openInfoWindowHtml(content, {
                'positioning': 'bottom-left'
            });
        }
    }
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTileLayerHotSpot', Ez.TileLayer.HotSpot);
