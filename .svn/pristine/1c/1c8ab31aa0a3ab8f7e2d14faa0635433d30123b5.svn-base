//FIXME Ez 图层切换控件，提供自定义html和css样式

goog.provide('Ez.control.Layers');

goog.require('ol.control.Control');

/**
 * 图层切换控件，支持自定义控件样式
 *
 * @constructor
 * @param {opt_options} options 
 *
 * @namespace Ez.control
 */
Ez.control.Layers = function(opt_options) {
    var options = { element: opt_options.element };
    this.layers_ = opt_options.layers;

    goog.base(this, options);
};
goog.inherits(Ez.control.Layers, ol.control.Control);

/**
 * 根据name进行切换
 * 
 * @param  {string} name 图层名
 */
Ez.control.Layers.prototype.swapTo = function(name) {
    var map = this.map_;
    if (!goog.isDef(name)) {
        return;
    }

    //检测目前图层是否是将要切换之图层
    var currentTileLayer = this.getCurrentTileLayer(),
        currentLayerName = currentTileLayer.get('ezname');
    if (name === currentLayerName) {
        return;
    }

    //对图层进行切换
    var layers = this.layers_,
        layer = layers[name];
    //目前视图投影参数以及目标图层数据源投影参数
    var currentViewProjection = map.getView().getProjection();
    var layerProjection, layerSourceReslutions;
    if (layer instanceof Ez.TileLayer.Group) {
        layerProjection = layer.getLayers().getArray()[0].getSource().getProjection();
        layerSourceReslutions = layer.getLayers().getArray()[0].getResolutions();
    } else {
        layerSourceReslutions = layer.getResolutions();
        layerProjection = layer.getSource().getProjection();
    }
    //目前视图中心坐标以及zoom
    var currentCoordinate = map.getView().getCenter(),
        currentZoom = map.getView().getZoom();
    //目前视图分辨率参数以及目标图层数据源网格分辨率参数

    //目前视图切换到目标参数
    var view = map.getView(),
        viewState = view.getState();

    var dest_coordinate = ol.proj.transform(currentCoordinate, currentViewProjection, layerProjection);
    var view_options = {
        center: dest_coordinate,
        projection: layerProjection,
        resolutions: layerSourceReslutions,
        zoom: currentZoom
    };

    map.removeLayer(currentTileLayer);
    map.setView(new ol.View(view_options));
    map.addLayer(layer);
};


/**
 * 获得最上层的瓦片图层
 * @return {Ez.TileLayer} 
 */
Ez.control.Layers.prototype.getCurrentTileLayer = function() {
    var tileLayers = this.map_.tileLayerGroup_.getLayers();
    return tileLayers.item(tileLayers.getLength() - 1);
};
