/*
|------------------------------------------------------------------------------
|                                   Ez.Map.js               
|
|@author: qianleyi
|@date: 2015-9-10
|@descript: 基础地图类,封装相关地图操作
|------------------------------------------------------------------------------
*/


goog.provide('Ez.Map');
goog.provide('Ez.ViewOptions');
goog.provide('Ez.PopupTargetMoveEvent');

goog.require('Ez.License');
goog.require('Ez.Coordinate');
goog.require('Ez.Overlay');
goog.require('Ez.MBR');
goog.require('Ez.Marker');
goog.require('Ez.Global');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Group');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.Feature');
goog.require('ol.Collection');
goog.require('ol.animation');
goog.require('ol.interaction.Draw');
goog.require('ol.interaction.Modify');
goog.require('goog.asserts');

/**
 * Popup打开和关闭的事件
 * @param {String} type
 */
Ez.PopupTargetMoveEvent = function (type) {
    goog.base(this, type);
};
goog.inherits(Ez.PopupTargetMoveEvent, ol.events.Event);


/**
 * @type {Object.<string,boolean>}
 */
Ez.ViewOptions = {
    'mapCenter': true,
    'mapInitLevel': true,
    'constrainRotation': true,
    'enableRotation': true,
    'extent': true,
    'minResolution': true,
    'maxResolution': true,
    'mapMinLevel': true,
    'mapMaxLevel': true,
    'projection': true,
    'resolution': true,
    'resolutions': true,
    'rotation': true,
    'zoomFactor': true
};


/**
 * @classdesc 地图客户端的核心控件，通过一个或者多个layer来渲染地图，可用DOM、Canvas以及WebGL进行地图渲染。
 *
 * @constructor
 * @example
 * var map = new EzMap('map',options);
 * 
 * @param {string} containerID - 地图展示容器，用于放置地图
 * @param {Ezx.MapOptions} EzMapOptions - 地图参数，初始化地图参数，不能为NULL
 * @extends {ol.Map}
 * @api
 * 
 */
Ez.Map = function (containerID, EzMapOptions) {

    var license = new Ez.License();
    license.init();
    if (!license.flag) {
        return;
    }

    var viewOptions = {};
    var mapOptions = {};
    /** 提取EzMapOptions中的ViewOptions和mapOptions */
    for (var opt in EzMapOptions) {
        if (opt in Ez.ViewOptions) {
            if (opt === 'mapCenter') {
                if (EzMapOptions[opt] instanceof Ez.Coordinate) {
                    viewOptions['center'] = [EzMapOptions[opt].x, EzMapOptions[opt].y];
                } else {
                    viewOptions['center'] = EzMapOptions[opt];
                }
            } else if (opt === 'mapInitLevel') {
                viewOptions['zoom'] = EzMapOptions[opt];
            } else if (opt === 'mapMinLevel') {
                viewOptions['minZoom'] = EzMapOptions[opt];
            } else if (opt === 'mapMaxLevel') {
                viewOptions['maxZoom'] = EzMapOptions[opt];
            } else {
                viewOptions[opt] = EzMapOptions[opt];
            }
        } else {
            mapOptions[opt] = EzMapOptions[opt];
        }
    }

    /** 如果ezMap文件修改viewOptions */
    var ezMap = window.ezMap;
    if (goog.isDef(ezMap)) {
        if (!goog.isDef(EzMapOptions) || !goog.isDef(EzMapOptions.indoor) || !EzMapOptions.indoor) {
            viewOptions.minZoom = ezMap.MapMinLevel;
            viewOptions.maxZoom = ezMap.MapMaxLevel;
            viewOptions.zoom = ezMap.MapInitLevel;
            viewOptions.center = ezMap.CenterPoint;
            viewOptions.extent = ezMap.MapFullExtent;
            viewOptions.projection = "EPSG:" + ezMap.MapSrcURL[0][2].crs;

            if (ezMap.MapSrcURL[0][2].type === 'EzMap2010' || ezMap.MapSrcURL[0][2].type === 'EzMap2010Local') {
                viewOptions.resolutions = Ez.TileLayer.EzMap2010.getResolutions(ezMap.MapMinLevel, ezMap.MapMaxLevel);
            }
        }
    }

    this.maxZoom_ = viewOptions.maxZoom;
    this.minZoom_ = viewOptions.minZoom;

    /** 创建内置的ol.view对象 */
    this.viewOfEz_ = new ol.View(viewOptions);

    this.elementOfEz_ = goog.isDef(containerID) ? containerID : undefined;

    /** 下面部分增加三个图层容器 */
    /**
     * @type {ol.layer.Group} Tile 容器图层组
     * @private
     */
    this.tileLayerGroup_ = new ol.layer.Group({
        layers: []
    });
    this.tileLayerGroup_.set('title', 'baseLayers');

    /**
     * @type {ol.layer.Group} Marker容器图层组
     * @private
     */
    this.markerLayerGroup_ = new ol.layer.Group({
        layers: []
    });
    this.markerLayerGroup_.set('title', 'markerLayers');
    /** 定义初始的一张marker vector layer */
    var markerlayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            wrapX: false
        }),
        projection: this.viewOfEz_.getProjection()
    });
    markerlayer.set('name', 'marker_default');
    this.defaultMarkerLayer_ = vectorlayer;
    this.markerLayerGroup_.getLayers().push(markerlayer);

    /**
     * @type {ol.layer.Group}  矢量数据容器图层组
     * @private
     */
    this.vectorLayerGroup_ = new ol.layer.Group({
        layers: []
    });
    this.vectorLayerGroup_.set('title', 'vectorLayers');
    /** 定义初始的一张vector layer */
    var vectorlayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            wrapX: false
        }),
        projection: this.viewOfEz_.getProjection()
    });
    vectorlayer.set('name', 'vector_default');
    this.defaultVectorLayer_ = vectorlayer;
    this.vectorLayerGroup_.getLayers().push(vectorlayer);

    /**
     * @type {ol.layer.Group} 自定义图层组，用于扩展用户需求图层
     * @private
     */
    this.customLayerGroup_ = new ol.layer.Group({
        layers: []
    });
    this.customLayerGroup_.set('title', 'customLayers');

    /**
     * @type {ol.layer.Group} 瓦片覆盖物图层组
     * @private
     */
    this.tileLayerOverlayGroup_ = new ol.layer.Group({
        layers: []
    });
    this.tileLayerOverlayGroup_.set('title', 'tileOverlayLayers');

    // 排列所有图层组容器
    var layers = [this.tileLayerGroup_, this.tileLayerOverlayGroup_, this.vectorLayerGroup_, this.customLayerGroup_, this.markerLayerGroup_];

    if (!goog.isDef(mapOptions.logo)) {
        mapOptions['logo'] = false;
    }

    mapOptions['layers'] = layers;
    mapOptions['target'] = this.elementOfEz_;
    mapOptions['view'] = this.viewOfEz_;
    mapOptions['controls'] = ol.control.defaults({
        'attribution': false,
        'rotate': false,
        'zoom': false
    });
    if (goog.isDef(ezMap)) {
        if (!goog.isDef(EzMapOptions) || !goog.isDef(EzMapOptions.indoor) || !EzMapOptions.indoor) {
            //在这里添加mapOptions参数
            mapOptions.loadTilesWhileAnimating = goog.isDef(ezMap.loadTilesWhileAnimating) ? ezMap.loadTilesWhileAnimating : false;
        }
    }

    goog.base(this, mapOptions);

    /** 运行时修改AppKey */
    var ezMapOpts = EzMapOptions ? EzMapOptions : {};
    if (goog.isDef(ezMapOpts.appkeys)) {
        var keys = ezMapOpts.appkeys;
        for (var i = 0; i < keys.length; i++) {
            var appkey = keys[i];
            if (appkey) {
                ezMap.MapSrcURL[i][2].appkey = appkey;
            }
        }
    }

    /** 初始化工作 */
    if (goog.isDef(ezMap)) {
        this.global_ = new Ez.Global(ezMap, this);
    }

    /* 一种Hacker方法：模拟OL3原生不支持movestart的事件方法 */
    // this.viewOfEz_.on('propertychange', this.onPropertyChange());
};
goog.inherits(Ez.Map, ol.Map);

// Ez.Map.prototype.onPropertyChange = function() {
//     if (!this.onpropertychange) {
//         this.onpropertychange = (function() {
//             this.dispatchEvent('movestart');
//             var view = this.viewOfEz_;
//             view.un('propertychange', this.onPropertyChange);
//             this.on('moveend', function() {
//                 view.on('propertychange', this.onPropertyChange);
//             });
//         }).bind(this);
//     }
//     return this.onpropertychange;
// };

/**
 * 得到tileLayerGroup 
 * @return {ol.layer.Group} 返回瓦片图层组
 */
Ez.Map.prototype.getTileLayers = function () {
    return this.tileLayerGroup_;
};

/**
 * 得到tileLayerOverlayGroup
 * @return {ol.layer.Group} 返回瓦片覆盖物图层组
 */
Ez.Map.prototype.getTileLayerOverlayLayers = function () {
    return this.tileLayerOverlayGroup_;
};

/**
 * 得到markerLayerGroup
 * @return {ol.layer.Group} 返回瓦片图层组
 */
Ez.Map.prototype.getMarkerLayers = function () {
    return this.markerLayerGroup_;
};

/**
 * 得到markerLayerGroup
 * @return {ol.layer.Group} 返回瓦片图层组
 */
Ez.Map.prototype.getVectorLayers = function () {
    return this.vectorLayerGroup_;
};

/**
 * 获取自定义扩展图层组
 * @return {ol.layer.Group}
 */
Ez.Map.prototype.getCustomLayers = function () {
    return this.customLayerGroup_;
};

/**
 * 获得大地坐标下的跨度，例如给定跨度为1000米，函数将根据给定点在地球上的位置返回一个跨度值（单位为度）
 * @param  {EzCoord} point
 * @param  {Number} meter
 * @return {Number}
 */
Ez.Map.prototype.getDegree = function (point, meter) {
    var dDegree = 1,
        coords = point.getCoordinate(),
        temp = parseFloat(coords[0]) + dDegree;
    var pPoint1 = [temp, coords[1]];
    var p1 = coords,
        p2 = pPoint1;
    var wgs84Sphere = new ol.Sphere(6378137),
        dMeter1 = wgs84Sphere.haversineDistance(p1, p2);

    var dResult = dDegree * meter / dMeter1;
    return dResult;
};

/**
 * 像素距离转大地距离
 * @param {Number} pdistance
 * @return {Number}
 */
Ez.Map.prototype.pixeldistance2KMdistance = function (pdistance) {
    var view = this.viewOfEz_;
    var resolution = view.getResolution();

    return pdistance * resolution;
};

/**
 * 增加瓦片图层到地图上
 * @param {Ez.TileLayer} [layer]瓦片图层
 */
Ez.Map.prototype.addlayer = function (layer, isNative) {
    if (isNative) {
        goog.base(this, 'addLayer', layer);
        return;
    }

    layer.onAdd(this);
};

/**
 * 从地图上移除瓦片地图
 * @param {Ez.TileLayer} [layer]瓦片图层
 */
Ez.Map.prototype.removelayer = function (layer, isNative) {
    if (isNative) {
        goog.base(this, 'removeLayer', layer);
        return;
    }

    layer.onRemove(this);
};

/**
 * 增加Overlay到地图上
 * @param {Ez.Overlay} [layer] [description]
 */
Ez.Map.prototype.addoverlay = function (layer, isNative) {
    if (isNative) {
        goog.base(this, 'addOverlay', layer);
        return;
    }

    layer.onAdd(this);

    /** 解决Overlay问题 */
    if (layer instanceof Ez.Popup) {
        goog.base(this, 'addOverlay', layer);
    } else if (layer instanceof Ez.HTMLElementOverLay) {
        goog.base(this, 'addOverlay', layer);
    }
};

/**
 * 从地图上移除Overlay
 * @param {Ez.Overlay} [layer] [description]
 */
Ez.Map.prototype.removeoverlay = function (layer, isNative) {
    if (isNative) {
        goog.base(this, 'removeOverlay', layer);
        return;
    }
    layer.onRemove(this);

    /** 解决Overlay问题 */
    if (layer instanceof Ez.Popup) {
        goog.base(this, 'removeOverlay', layer);
    } else if (layer instanceof Ez.HTMLElementOverLay) {
        goog.base(this, 'removeOverlay', layer);
    }
};

/**
 * 获取地图的中心坐标
 * @return {Ez.Coordinate} [description]
 */
Ez.Map.prototype.getCenter = function () {
    var center = this.viewOfEz_.getCenter();
    return new Ez.Coordinate(center[0], center[1]);
};

/**
 * 地图放大
 */
Ez.Map.prototype.zoomIn = function () {
    var resolution = this.viewOfEz_.getResolution();
    if (resolution <= this.viewOfEz_.minResolution_) {
        return;
    }
    this.doZoom(0.5);
};

/**
 * 地图缩小
 */
Ez.Map.prototype.zoomOut = function () {
    var resolution = this.viewOfEz_.getResolution();
    if (resolution >= this.viewOfEz_.maxResolution_) {
        return;
    }
    this.doZoom(2);
};

/**
 * 获取当前的地图级别
 * @return {number} 地图级别
 */
Ez.Map.prototype.getZoom = function () {
    return this.viewOfEz_.getZoom();
};

/**
 * 动画缩放
 * @param {number} factor 缩放因子
 */
Ez.Map.prototype.doZoom = function (factor) {
    var map = this;
    var zoom = ol.animation.zoom({
        resolution: this.viewOfEz_.getResolution()
    });
    map.beforeRender(zoom);
    map.getView().setResolution(this.viewOfEz_.getResolution() * factor);
};

/**
 * 显示标准地图级别控制条控件
 * @param  {Object} options [description]
 * @return {[type]}         [description]
 */
Ez.Map.prototype.showStandMapControl = function (options) {
    if (this.zoomslider_) return;
    var globalOptions = this.global_.getGlobalOptions();
    var opts = goog.isDef(globalOptions) ? globalOptions : {};
    options = goog.isDef(options) ? options : {};
    var maxZoom = goog.isDef(opts.MapMaxLevel) ? opts.MapMaxLevel : (goog.isDef(options.maxZoom) ? options.maxZoom : 18);
    var minZoom = goog.isDef(opts.MapMinLevel) ? opts.MapMinLevel : (goog.isDef(options.minZoom) ? options.minZoom : 0);
    var isTitleArea = goog.isDef(opts.isTitleArea) ? opts.isTitleArea : (goog.isDef(options.isTitleArea) ? options.isTitleArea : false);
    var flag2level = goog.isDef(opts.flag2level) ? opts.flag2level : (goog.isDef(options.flag2level) ? options.flag2level : undefined);

    this.zoomslider_ = new Ez.controls.ZoomSlider({
        maxZoom: maxZoom,
        minZoom: minZoom,
        isTitleArea: isTitleArea,
        flag2level: flag2level
    });
    this.addControl(this.zoomslider_);
};

/**
 * 显示丰富地图级别控制条控件
 * @param  {Object} options [description]
 * @return {[type]} [description]
 */
Ez.Map.prototype.showMapControl = function (options) {
    if (this.navi_ || this.zoomslider_) return;
    var globalOptions = this.global_.getGlobalOptions();
    var opts = goog.isDef(globalOptions) ? globalOptions : {};
    options = goog.isDef(options) ? options : {};
    var maxZoom = goog.isDef(opts.MapMaxLevel) ? opts.MapMaxLevel : (goog.isDef(options.maxZoom) ? options.maxZoom : 18);
    var minZoom = goog.isDef(opts.MapMinLevel) ? opts.MapMinLevel : (goog.isDef(options.minZoom) ? options.minZoom : 0);
    var isTitleArea = goog.isDef(opts.isTitleArea) ? opts.isTitleArea : (goog.isDef(options.isTitleArea) ? options.isTitleArea : false);
    var flag2level = goog.isDef(opts.flag2level) ? opts.flag2level : (goog.isDef(options.flag2level) ? options.flag2level : undefined);

    this.zoomslider_ = new Ez.controls.ZoomSlider({
        maxZoom: maxZoom,
        minZoom: minZoom,
        isTitleArea: isTitleArea,
        flag2level: flag2level
    });
    this.addControl(this.zoomslider_);

    this.navi_ = new Ez.controls.NavBar();
    this.addControl(this.navi_);
};

/**
 * 隐藏地图级别控制条
 * @return {[type]} [description]
 */
Ez.Map.prototype.hideMapControl = function () {
    if (this.navi_) {
        this.removeControl(this.navi_);
        this.navi_ = null;
    }
    if (this.zoomslider_) {
        this.removeControl(this.zoomslider_);
        this.zoomslider_ = null;
    }
};

/**
 * 显示简约版地图缩放控件
 */
Ez.Map.prototype.showSimpleZoomControl = function () {
    if (!this.simplezoom_) {
        this.simplezoom_ = new Ez.controls.SimpleZoom();
        this.addControl(this.simplezoom_);
    }
};

/**
 * 隐藏简约版地图缩放控件
 */
Ez.Map.prototype.hideSimpleZoomControl = function () {
    if (this.simplezoom_) {
        this.removeControl(this.simplezoom_);
        delete this.simplezoom_;
    }
};

/**
 * 初始图层切换控件，但是不显示
 */
Ez.Map.prototype.initLayersControl = function () {
    var config = this.getConfig();
    var layerInfo = config.getLayersInfo();
    var layersControl = new Ez.controls.SimpleLayers(layerInfo);
    this.layersControl_ = layersControl;
    this.addControl(layersControl);
    layersControl.changed();
    var ezLayer = document.getElementById("ez_simple_layers");
    ezLayer.style.display = "none";
};


/**
 * 显示图层切换控件，自定义需要配置回调函数
 * @param  {Function} fn 返回json对象: layerInfo--图层信息，type--控件类型
 */
Ez.Map.prototype.showLayersControl = function (fn) {
    var config = this.getConfig();
    var layerInfo = config.getLayersInfo();
    var type = "default";
    var result;
    var layersControl;
    if (fn) {
        result = fn(layerInfo, type);
        layerInfo = result.layerInfo;
        type = result.type;
    }

    switch (type) {
        case "default":
            layersControl = new Ez.controls.Layers(layerInfo);
            break;
        case "simple":
            layersControl = new Ez.controls.SimpleLayers(layerInfo);
            break;
    }

    this.addControl(layersControl);
    this.layersControl_ = layersControl;
    if (type === 'default') {
        layersControl.refesh();
    } else {
        layersControl.changed();
    }

};

/**
 * 隐藏地图图层切换控件
 */
Ez.Map.prototype.hideLayersControl = function () {
    this.removeControl(this.layersControl_);
    delete this.layersControl_;
};

/**
 * 获取配置对象
 * @return {Object}
 */
Ez.Map.prototype.getConfig = function () {
    return this.global_;
};

/**
 * 添加地图事件监听
 * @param {Ez.Event|string|Array.<string>} eventType EzServerClient事件类型枚举对象
 * @param {function(...)} handler   事件相应的处理函数
 * @param {Object} [opt_this] this对象
 * @return {ol.events.Key} 标识
 */
Ez.Map.prototype.addMapEventListener = function (eventType, handler, opt_this) {
    var eventid;
    if (Ez.Event.MAP_ZOOMCHANGE === eventType) {
        eventid = this.viewOfEz_.on(eventType, handler, opt_this);
    } else {
        eventid = this.on(eventType, handler, opt_this);
    }
    return eventid;
};

/**
 * 添加一次地图事件监听
 * @param {Ez.Event|string|Array.<string>} eventType EzServerClient事件类型枚举对象
 * @param {function(...)} handler   事件相应的处理函数
 * @param {Object} [opt_this] this对象
 * @return {ol.events.Key} 标识
 */
Ez.Map.prototype.addMapEventListenerOnce = function (eventType, handler, opt_this) {
    var eventid;
    if (Ez.Event.MAP_ZOOMCHANGE === eventType) {
        eventid = this.viewOfEz_.once(eventType, handler, opt_this);
    } else {
        eventid = this.once(eventType, handler, opt_this);
    }
    return eventid;
};

/**
 * 注销地图事件监听
 * @param  {ol.events.Key} eventListener addMapEventListener()返回标识uid
 */
Ez.Map.prototype.removeMapEventListener = function (eventListener) {
    this.unByKey(eventListener);
};

/**
 * 平移地图到指定的中心坐标点
 * @param {Ez.Coordinate|string|number} [centerOrx] 中心点坐标或者是x字符串
 * @param {string|number=} [y]
 */
Ez.Map.prototype.centerAtLatlng = function (centerOrx, y) {
    var coorArr;
    if (centerOrx instanceof Ez.Coordinate) {
        coorArr = centerOrx.getCoordinate();
    }

    if (goog.isDef(y)) {
        if (goog.isNumber(centerOrx) || goog.isString(centerOrx)) {
            coorArr = [parseFloat(centerOrx), parseFloat(y)];
        }
    }

    if (!coorArr) {
        goog.asserts.assert(false, '参数类型不正确或者输入格式有误');
    }

    this.viewOfEz_.setCenter(coorArr);
};

/**
 * 显示地图比例尺
 */
Ez.Map.prototype.showScaleControl = function () {
    this.scale_ = new Ez.controls.ScaleLine();
    this.addControl(this.scale_);
};

/**
 * 隐藏地图比例尺
 */
Ez.Map.prototype.hideScaleControl = function () {
    this.removeControl(this.scale_);
    delete this.scale_;
};

/**
 * 显示鹰眼
 */
Ez.Map.prototype.showOverviewControl = function () {
    this.overview_ = new Ez.controls.Overview();
    this.addControl(this.overview_);
};

/**
 * 隐藏鹰眼
 */
Ez.Map.prototype.hideOverviewControl = function () {
    this.removeControl(this.overview_);
    delete this.overview_;
};

/**
 * 根据中心坐标以及缩放级别确定地图的范围
 * @param {!Ez.Coordinate} [point] 定位的中心点坐标
 * @param {!number} [zoomlevel] 定位的地图级别
 */
Ez.Map.prototype.centerAndZoom = function (point, zoomlevel) {
    goog.asserts.assert(goog.isDef(point), '缩放级别不能为undefined');
    goog.asserts.assert((point instanceof Ez.Coordinate), 'point 参数必须为EzCoord类型');
    var coorArr = point.getCoordinate();
    goog.asserts.assert(goog.isDef(zoomlevel), '缩放级别不能为undefined');
    goog.asserts.assert(goog.isNumber(zoomlevel), '缩放级别必须为数值类型');

    this.viewOfEz_.setCenter(coorArr);
    this.viewOfEz_.setZoom(zoomlevel);
};

/**
 * 根据MBR定义地图视图范围
 * @param  {Ez.MBR|Array} [mbr] Ez.MBR对象实例或者Array([minX,minY,maxX,maxY])
 */
Ez.Map.prototype.centerAtMBR = function (mbr) {
    if (mbr instanceof Ez.MBR) {
        var extent = mbr.value_;
    } else {
        goog.asserts.assert(goog.isArray(mbr), '目标包络框类型错误');
        var extent = mbr;
    }
    var size = this.getSize();
    this.viewOfEz_.fit(extent, size);
};

/**
 * zoom到指定的地图级别
 * @param  {Number} zoomlevel [description]
 * @return {[type]}           [description]
 */
Ez.Map.prototype.zoomTo = function (zoomlevel) {
    goog.asserts.assert(goog.isDef(zoomlevel), '缩放级别不能为undefined');
    goog.asserts.assert(goog.isNumber(zoomlevel), '缩放级别必须为数值类型');

    this.viewOfEz_.setZoom(zoomlevel);
};

/**
 * 设置地图当前绘制模式
 * @param  {string}   [drawMode] 绘制方法
 * @param  {Function} [callback] 回调处理
 */
Ez.Map.prototype.changeDragMode = function (drawMode, callback, editObject, state, callback2) {

    var geomClassFunction;

    switch (drawMode) {
        case ('drawPoint'):
            {
                this.drawType_('Point');
                geomClassFunction = Ez.g.Point;
                break;
            }
        case ('drawPolyline'):
            {
                this.drawType_('LineString');
                geomClassFunction = Ez.g.Polyline;
                break;
            }
        case ('drawPolygon'):
            {
                this.drawType_('Polygon');
                geomClassFunction = Ez.g.Polygon;
                break;
            }
        case ('drawCircle'):
            {
                this.drawType_('Circle');
                geomClassFunction = Ez.g.Circle;
                break;
            }
        case ('drawRect'):
            {
                this.drawType_('Rect');
                geomClassFunction = Ez.g.Rectangle;
                break;
            }
        case ('measureLine'):
            {
                if (!goog.isDef(this.draw_)) {
                    this.draw_ = new Ez.utility.Measure('LineString', this, callback);
                } else {
                    if (this.draw_ instanceof ol.interaction.Draw2) {
                        this.removeInteraction(this.draw_);
                        this.draw_ = new Ez.utility.Measure('LineString', this, callback);
                    } else {
                        if (this.draw_.draw) {
                            this.draw_.de_init();
                        }
                        this.draw_ = new Ez.utility.Measure('LineString', this, callback);
                    }
                }
                return;
            }
        case ('measureArea'):
            {
                if (!goog.isDef(this.draw_)) {
                    this.draw_ = new Ez.utility.Measure('Polygon', this, callback);
                } else {
                    if (this.draw_ instanceof ol.interaction.Draw2) {
                        this.removeInteraction(this.draw_);
                        this.draw_ = new Ez.utility.Measure('Polygon', this, callback);
                    } else {
                        if (this.draw_.draw) {
                            this.draw_.de_init();
                        }
                        this.draw_ = new Ez.utility.Measure('Polygon', this, callback);
                    }
                }
                return;
            }
        case ('editGeometry'):
            {
                if (state === 'on') {
                    if (!editObject) {
                        return;
                    }
                    this.draw_ = new ol.interaction.Modify({
                        features: new ol.Collection([editObject])
                    });
                    this.addInteraction(this.draw_);
                    break;
                } else {
                    // 更新要素的coordString
                    var arr = editObject.getGeometry().getCoordinates();
                    var sarr = arr.map(function (l) {
                        return l.join(',');
                    });
                    editObject.coordString = sarr.join(',');
                    callback(editObject);
                    this.removeInteraction(this.draw_);
                    this.draw_ = undefined;
                    break;
                }
            }
        case ('editCircle'):
            {
                if (state === 'on') {
                    if (!editObject) {
                        return;
                    }
                    this.draw_ = new ol.interaction.EditCircle(editObject, callback, callback2);
                    this.addInteraction(this.draw_);
                    break;
                } else {
                    this.draw_.disposeAll(callback);
                    this.removeInteraction(this.draw_);
                    this.draw_ = undefined;
                    break;
                }
            }
    }

    var self_ = this;
    if (goog.isDef(callback) && drawMode !== "editGeometry" && drawMode !== "editCircle") {
        this.draw_.on('drawend', function (e) {
            var geom = e.feature.getGeometry();
            if (geom.getType() === 'Circle') {
                var coords = geom.getCenter();
                var radius = geom.getRadius();
                //统一处理半径问题：OL3规定的圆的半径是按照坐标参考的单位来确定圆的半径单位的。也就是说'EPSG:4326'的单位是degree,'EPSG:3857'的单位是meter.
                //现在把传入的坐标统一成meter
                var p1 = coords;
                var p2 = [p1[0] + 1, p1[1]];
                var dmeter = ol.sphere.WGS84.haversineDistance(p1, p2);
                radius = radius * dmeter;
                //-------------------------------------------------------------
                var geomObj = new geomClassFunction(new Ez.Coordinate(coords[0], coords[1]), radius);
            } else if (geom.getType() === 'Point') {
                var coords = geom.getCoordinates();
                var geomObj = new geomClassFunction(new Ez.Coordinate(coords[0], coords[1]));
            } else {
                var coords = geom.getCoordinates();
                var geomObj = new geomClassFunction(coords);
            }
            callback(geomObj);
            self_.removeInteraction(self_.draw_);
            self_.draw_ = undefined;
        });
    }
};

/**
 * 手动清除绘图模式
 */
Ez.Map.prototype.clearDragMode = function () {
    if (this.draw_) {
        // 基础绘图对象判断
        if (this.draw_ instanceof ol.interaction.Draw2) {
            this.removeInteraction(this.draw_);
            delete this.draw_;
            // 测量对象判断
        } else if (this.draw_.draw) {
            this.draw_.de_init();
            delete this.draw_;
        }
    }
};

/**
 * 用来给changeDragMode加Lock
 * @private
 * @param  {string} [type] type
 */
Ez.Map.prototype.drawType_ = function (type) {
    var draw_opts = {};
    if (type === 'Rect') {
        draw_opts.type = 'LineString';
        draw_opts.source = this.defaultVectorLayer_.getSource();
        draw_opts.maxPoints = 2;
        draw_opts.geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
                [start, [start[0], end[1]], end, [end[0], start[1]], start]
            ]);
            return geometry;
        };
    } else {
        draw_opts.type = type;
        draw_opts.source = this.defaultVectorLayer_.getSource();
    }

    if (!goog.isDef(this.draw_)) {
        this.draw_ = new ol.interaction.Draw2(draw_opts);
        this.addInteraction(this.draw_);
    } else {
        if (this.draw_ instanceof ol.interaction.Draw2) {
            this.removeInteraction(this.draw_);
            this.draw_ = new ol.interaction.Draw2(draw_opts);
            this.addInteraction(this.draw_);
        } else {
            if (this.draw_.draw) {
                this.draw_.de_init();
            }
            this.draw_ = new ol.interaction.Draw2(draw_opts);
            this.addInteraction(this.draw_);
        }

    }
};

/**
 * 动画平移函数，新的定位函数，提供动画展示
 * @param  {!Ez.Coordinate} [location] 定位对象
 * @param  {string} [type] 平移方式 默认为平移方式
 * @param  {Object=} [opt_options] 用于修改具体的缓动函数
 */
Ez.Map.prototype.animationTo = function (location, type, opt_options) {
    var map = this;
    var view = this.viewOfEz_;

    //动画参数:
    var duration = goog.isDef(opt_options) ? (goog.isDef(opt_options.duration) ? opt_options.duration : 2000) : 2000;
    var source = view.getCenter();

    if (type === 'fly') {
        var start = +new Date();
        var pan = ol.animation.pan({
            duration: duration,
            start: start,
            source: source
        });
        var bounce = ol.animation.bounce({
            duration: duration,
            resolution: 4 * view.getResolution(),
            start: start
        });
        map.beforeRender(pan, bounce);
    } else if (type === 'spiral') {
        var start = +new Date();
        var pan = ol.animation.pan({
            duration: duration,
            start: start,
            source: source
        });
        var bounce = ol.animation.bounce({
            duration: duration,
            resolution: 2 * view.getResolution(),
            start: start
        });
        var rotate = ol.animation.rotate({
            duration: duration,
            rotation: -4 * Math.PI,
            start: start
        });
        map.beforeRender(pan, bounce, rotate);
    } else {
        var pan = new ol.animation.pan({
            duration: duration,
            source: source
        });
        map.beforeRender(pan);
    }
    view.setCenter(location.getCoordinate());
};

/**
 * zoom 动画到 指定级别
 * @param {number} zoomLevel [description]
 * @param {Object} options   [description]
 */
Ez.Map.prototype.zoomAnimationTo = function (zoomLevel, options) {
    var map = this;
    var opts = goog.isDef(options) ? options : {};
    var fn = opts.fn;
    var start = +new Date();
    var zoomani = new ol.animation.zoom({
        resolution: this.getView().getResolution(),
        start: start,
        duration: goog.isDef(opts.duration) ? opts.duration : 2000,
        easing: goog.isDef(opts.easing) ? opts.easing : ol.easing.inAndOut
    });
    map.beforeRender(function (map, frameState) {
        var stillAnimating = zoomani(map, frameState);
        if (!stillAnimating) {
            if (fn) {
                fn();
            }
        }
        return stillAnimating;
    });
    // map.beforeRender(zoomani);
    map.viewOfEz_.setZoom(zoomLevel);
};

/**
 * 打开popup
 * @param  { Ez.Coordinate | ol.Coordinate } coord
 * @param  { Ez.Popup | string } strHtml
 */
Ez.Map.prototype.openInfoWindow = function (strHtml, coord, options) {
    var position;
    if (coord instanceof Ez.Coordinate) {
        position = coord.getCoordinate();
    } else if (goog.isArray(coord)) {
        position = coord;
    } else {
        goog.asserts.assert(false, '参数类型不正确或者输入格式有误');
    }

    if (this.popup_) {
        this.removeOverlay(this.popup_);
        this.popup_ = null;
    }
    this.popup_ = new Ez.Popup(options);
    this.popup_.on('CLOSE', this.assignPopup2null_.bind(this));
    this.addOverlay(this.popup_);
    this.popup_.show(strHtml, position);
};

/**
 * 解除地图泡泡的绑定
 * @private
 */
Ez.Map.prototype.assignPopup2null_ = function () {
    this.popup_ = null;
};

/**
 * 关闭popup
 */
Ez.Map.prototype.closeInfoWindow = function () {
    if (!this.popup_) {
        return;
    }
    this.popup_.close();
};

/**
 * 获取当前窗口的包络框对象
 * @return {Ez.MBR} [description]
 */
Ez.Map.prototype.getBoundsLatLng = function () {
    var viewbounds = this.viewOfEz_.calculateExtent(this.getSize());
    return new EzMBR(viewbounds[0], viewbounds[1], viewbounds[2], viewbounds[3]);
};

/**
 * 清除所有地图的上叠加要素
 */
Ez.Map.prototype.clear = function () {
    //canvas绘制要素集
    var layersCollections = this.getLayers();
    var map = this;
    layersCollections.forEach(function (ele, index, arr) {
        if (ele.get('title') !== 'baseLayers') {
            if (ele instanceof ol.layer.Group) {
                ele.getLayers().forEach(function (layer) {
                    if (!(layer instanceof Ez.TileLayer.SingleHotSpot)) {
                        layer.getSource().clear();
                    } else {
                        if (layer.onRemove) {
                            map.removeLayer(layer);
                        } else {
                            map.removeLayer(layer, true);
                        }
                    }
                });
            } else {
                ele.getSource().clear()
            }
        }
    });
    //DOM叠加要素
    var domCollections = this.getOverlays();
    if (domCollections.getLength() !== 0) {
        domCollections.clear();
    }
};

/**
 * 使得可拖拽元素能够在地图上实现拖拽交互
 */
Ez.Map.prototype.draggable = function () {
    this.dragfeatureinteraction = new ol.interaction.DragFeature();
    this.addInteraction(this.dragfeatureinteraction);
};

/**
 * 关闭拖拽交互
 */
Ez.Map.prototype.disdraggable = function () {
    this.removeInteraction(this.dragfeatureinteraction);
    delete this.dragfeatureinteraction;
};

/**
 * 启用地图双击缩放功能
 */
Ez.Map.prototype.enabledblZoom = function () {
    if (this.dblzoominteraction) {
        if (!this.dblzoominteraction.isOnMap && this.dblzoominteraction.interaction) {
            this.addInteraction(this.dblzoominteraction.interaction);
            this.dblzoominteraction.isOnMap = true;
        }
    }
};

/**
 * 关闭地图双击缩放功能
 */
Ez.Map.prototype.disabledblZoom = function () {
    if (!this.dblzoominteraction) {
        var interactions = this.getInteractions();
        this.dblzoominteraction = { 'interaction': null, 'isOnMap': null };
        var self = this;
        interactions.forEach(function (val) {
            if (val instanceof ol.interaction.DoubleClickZoom) {
                self.dblzoominteraction.interaction = val;
            }
        });
    }
    this.removeInteraction(this.dblzoominteraction.interaction);
    this.dblzoominteraction.isOnMap = false;
};

/**
 * 获取用于地图打印的要素对象
 * @return {Object}
 */
Ez.Map.prototype.getAllFeaturesFromMap = function () {
    var arrOfFeature = []; //包括要素和DOM要素
    var arrOfTile = [];
    //塞入Ez.Overlay对象
    arrOfFeature = arrOfFeature.concat(this.getOverlays().getArray());
    //处理markerLayerGroup
    var markerlayers = this.getMarkerLayers().getLayers().getArray();
    markerlayers.forEach(function (ele) {
        arrOfFeature = arrOfFeature.concat(ele.getSource().getFeatures());
    });
    //处理vectorLayerGroup
    var vectorlayers = this.getVectorLayers().getLayers().getArray();
    vectorlayers.forEach(function (ele) {
        arrOfFeature = arrOfFeature.concat(ele.getSource().getFeatures());
    });

    //收集Tile数据
    var tilelayers = this.getTileLayers().getLayers().getArray();
    arrOfTile = arrOfTile.concat(tilelayers);

    return { features: arrOfFeature, tile: arrOfTile };
};

/**
 * 增加图层到指定的图层组
 * @param {Ez.TileLayer.Base} layer
 * @param {ol.layer.Group} group
 */
Ez.Map.prototype.addLayerToContainer = function (layer, group) {
    group.getLayers().push(layer);
};

/**
 * 从指定的图层组删除图层
 * @param {Ez.TileLayer.Base} layer
 * @param {ol.layer.Group} group
 */
Ez.Map.prototype.removeFromContainer = function (layer, group) {
    group.getLayers().remove(layer);
};

/**
 * 增加比例尺到地图上
 * @param {Object} 相关配置参数
 */
Ez.Map.prototype.addScaleLineControl = function (options) {
    this.scaleline_ = new Ez.controls.ScaleLine(options);
    map.addControl(this.scaleline_);
};

/**
 * 从地图上删除比例尺
 */
Ez.Map.prototype.removeScaleLineControl = function () {
    if (!this.scaleline_) return;
    map.removeControl(this.scaleline_);
    delete this.scaleline_;
};

/**
 * 增加鹰眼到地图上
 * @param {Object} 相关配置参数
 */
Ez.Map.prototype.addOverviewControl = function (options) {
    this.overview_ = new Ez.controls.Overview(options);
    map.addControl(this.overview_);
};

/**
 * 从地图上删除鹰眼
 */
Ez.Map.prototype.removeOverviewControl = function () {
    if (!this.overview_) return;
    map.removeControl(this.overview_);
    delete this.overview_;
};

/**
 * 通过传入一个Ez.MBR计算其包括的网格数量
 * @param  {Ez.MBR} mbr 
 * @return {Number}     
 */
Ez.Map.prototype.calculateTileCount = function (mbr, zoom, isTDT) {
    tdt = isTDT ? isTDT : true;
    var extent = mbr.getExtent();
    var maxRes = 360 / 256;
    var resolutions = new Array(22);
    for (var z = 0; z <= 22; ++z) {
        resolutions[z] = maxRes / Math.pow(2, z);
    }
    var tilegrid = new ol.tilegrid.TileGrid({
        resolutions: resolutions,
        origin: tdt ? [-180, 90] : [0, 0]
    });
    var tileRange = tilegrid.getTileRangeForExtentAndZ(extent, zoom);
    return (tileRange.maxX - tileRange.minX + 1) * (tileRange.maxY - tileRange.minY + 1);
};

Ez.Map.prototype.getMaxZoom = function () {
    return this.maxZoom_;
};

Ez.Map.prototype.getMinZoom = function () {
    return this.minZoom_;
};

/**
 * 获取地图客户端版本号
 * @return {String}
 */
Ez.Map.getVersion = function () {
    return 'EzServerClient 7.1.21';
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzMap', Ez.Map);

goog.exportProperty(Ez.Map.prototype, 'addLayer', Ez.Map.prototype.addlayer);
goog.exportProperty(Ez.Map.prototype, 'removeLayer', Ez.Map.prototype.removelayer);
goog.exportProperty(Ez.Map.prototype, 'addOverlay', Ez.Map.prototype.addoverlay);
goog.exportProperty(Ez.Map.prototype, 'removeOverlay', Ez.Map.prototype.removeoverlay);
// goog.exportProperty(Ez.Map.prototype,'zoomIn',Ez.Map.prototype.zoomIn);
// goog.exportProperty(Ez.Map.prototype,'zoomOut',Ez.Map.prototype.zoomOut);
