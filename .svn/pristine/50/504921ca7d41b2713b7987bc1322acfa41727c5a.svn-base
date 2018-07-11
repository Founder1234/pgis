/*
|------------------------------------------------------------------------------
|								Ez.TileLayer.HotSpot				
|
|@author: qianleyi
|@date: 2016-04-05
|@descript: 基于canvas的热点技术，支持对多源热点的渲染控制
|------------------------------------------------------------------------------
*/
goog.provide('Ez.TileLayer.HotSpot');

goog.require('ol.layer.Vector');
goog.require('ol.source.HotSpot2');
goog.require('Ez.Marker');
goog.require('Ez.Coordinate');

/**
 * 多源热点渲染图层
 *
 * @constructor
 * @param {Object} options 注册热点图层参数
 * @extends {ol.layer.Vector}
 */
Ez.TileLayer.HotSpot = function(options) {

    var opts = options || {};

    var source = new ol.source.HotSpot2(opts);

    goog.base(this, {
        source: source
    });

    this.set('layerType', 'hotspotLayer-TileImage');

    this.vectorLayer_ = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

    this.vectorLayer_.set('layerType', 'hotspotLayer-Vector');

    this.source_ = source;

    this.imageCache = {};

    this.lastMarker = null;
};
goog.inherits(Ez.TileLayer.HotSpot, ol.layer.Tile);

/**
 * 给图层增加map属性，并提供其他操作
 * @param {Ez.Map} map Ez.Map 对象
 */
Ez.TileLayer.HotSpot.prototype.onAdd = function(map) {
    this.map_ = map;

    var layerGroups = map.getLayers();

    layerGroups.insertAt(1, this);
    layerGroups.insertAt(1, this.vectorLayer_);

    var view = map.getView();
    view.on('change:resolution', this.cleanMarks.bind(this));
    this.source_.on('updateRender', this.updateAndRender.bind(this));

    //热点的movemove事件
    map.on('pointermove', this.onMouseMove.bind(this));
};

/**
 * 给图层增加map属性，并提供其他操作
 * @param {Ez.Map} map Ez.Map 对象
 */
Ez.TileLayer.HotSpot.prototype.onRemove = function(map) {

    var view = map.getView();
    view.un('change:resolution', this.cleanMarks.bind(this));
    this.source_.un('updateRender', this.updateAndRender.bind(this));
    //解除热点的movemove事件
    map.un('pointermove', this.onMouseMove.bind(this));

    this.map_ = null;

    var layerGroups = map.getLayers();
    layerGroups.forEach(function(layer) {
        if (layer.get('layerType') === 'hotspotLayer-TileImage') {
            map.removeLayer(layer);
        } else if (layer.get('layerType') === 'hotspotLayer-Vector') {
            map.removeLayer(layer);
        }
    });
};

Ez.TileLayer.HotSpot.prototype.onMouseMove = function(evt) {
    var map = evt.map;
    var pixel = evt.pixel;

    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer.get('layerType') === 'hotspotLayer-Vector') {
            return feature;
        }
    });

    if (feature) {
        map.getTargetElement().style.cursor = 'pointer';
        //如果两个要素相邻，不会先执行else中的语句
        if (this.lastMarker) {
            if (this.lastMarker !== feature) {
                this.lastMarker.setStyle(new ol.style.Style({
                    image: this.imageCache[this.lastMarker.get('nameIndex')]
                }));
            } else {
                return;
            }
        }

        feature.setStyle(new ol.style.Style({
            image: this.imageCache[feature.get('nameIndex') + '_interaction']
        }));
        this.lastMarker = feature;
    } else {
        map.getTargetElement().style.cursor = '';
        if (this.lastMarker) {
            this.lastMarker.setStyle(new ol.style.Style({
                image: this.imageCache[this.lastMarker.get('nameIndex')]
            }));
        }
    }
};

Ez.TileLayer.HotSpot.prototype.updateAndRender = function(evt) {
    var source = this.source_;
    var data = source.getMarkerData();
    var zoom = evt.zIndex;
    var viewData_ = [];

    var vectorSource = this.vectorLayer_.getSource();

    for (var zIndex in data) {
        if (zoom !== Number(zIndex)) continue;
        for (var xyIndex in data[zIndex]) {
            for (var nameIndex in data[zIndex][xyIndex]) {
                var dataOfTile = data[zIndex][xyIndex][nameIndex];
                if (!this.imageCache[nameIndex]) {
                    this.imageCache[nameIndex] = dataOfTile.icon;
                    this.imageCache[nameIndex].load();
                }

                if (!this.imageCache[nameIndex + '_interaction']) {
                    this.imageCache[nameIndex + '_interaction'] = dataOfTile.iconInteraction;
                    this.imageCache[nameIndex + '_interaction'].load();
                }

                var arrOfTile = dataOfTile.data;
                if (!arrOfTile || arrOfTile.length === 0) continue;
                for (var i = 0; i < arrOfTile.length; i++) {
                    var mark = arrOfTile[i];
                    var coords = new Ez.Coordinate(mark.X, mark.Y);
                    var marker = new Ez.Marker(coords, this.imageCache[nameIndex]);
                    marker.set('val', mark.LABEL);
                    marker.set('nameIndex', nameIndex);
                    viewData_.push(marker);
                }
            }
        }
        break;
    }

    vectorSource.addFeatures(viewData_);
};

Ez.TileLayer.HotSpot.prototype.cleanMarks = function() {
    var vectorSource = this.vectorLayer_.getSource();
    vectorSource.clear();

    var view = this.map_.getView();
    var zoom = view.getZoom();

    var source = this.source_;
    var data = source.getMarkerData();
    if (!data[zoom]) return;
    this.source_.dispatchEvent(new ol.HotSpotEvent('updateRender', zoom));
};
