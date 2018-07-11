/*
|------------------------------------------------------------------------------
|                               Ez.utility.Measure              
|
|@author: qianelyi
|@date: 2016-04-07
|@descript: 实现OL3的测量工具，集成版本
|------------------------------------------------------------------------------
*/
goog.provide('Ez.utility.Measure');

goog.require('ol.Object');
goog.require('ol.interaction.Draw');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');
goog.require('ol.Overlay');
goog.require('ol.Feature');
goog.require('ol.geom.LineString');
goog.require('ol.geom.Polygon');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');

/**
 * 测量集成工具类
 *
 * @constructor
 * @param {String} type - 测量的类型，枚举类型:"LINE","POLYGON"
 * @param {Ez.Map} map - 地图对象的引用
 * @param {Function} callback - 绘制完成后的回调方法
 * @extends {ol.Object}
 */
Ez.utility.Measure = function(type, map, callback) {

    goog.base(this);

    /**
     * 定义要绘制并测量的要素类型
     * @type {String}
     */
    this.type = type;

    /**
     * 地图引用接口
     * @type {Ez.Map}
     */
    this.map_ = map;

    /**
     * 要执行的回调函数
     * @type {Function}
     */
    this.fn_ = callback;

    /**
     * 存储回调函数的参数数据
     * @type {Object}
     */
    this.callbackData = null;

    /**
     * 目前的绘制要素
     * @type {ol.Feature}
     */
    this.sketch = null;

    /**
     * sketch样式信息
     * @type {ol.style.Style}
     */
    this.sketchStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(67, 78, 255, 0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(67, 78, 255, 0.8)',
            width: 2
        })
    });

    /**
     * 帮助提示元素
     * @type {Element}
     */
    this.helpTooltipElement = null;

    /**
     * 帮助提示overlay
     * @type {ol.Overlay}
     */
    this.helpTooltip = null;

    /**
     * 测量提示元素
     * @type {Element}
     */
    this.measureTooltipElement = null;

    /**
     * 测量提示Overlay
     * @type {ol.Overlay}
     */
    this.measureTooltip = null;

    /**
     * 继续绘制多边形提示信息  
     * @type {String}
     */
    this.continuePolygonMsg = "点击右键结束测量";

    /**
     * 继续绘制多义线提示信息
     * @type {String}
     */
    this.continueLineMsg = "点击右键结束测量";

    /**
     * vector图层用于存储绘制的图形
     * @type {ol.layer.Vector}
     */
    this.vectorLayer = null;

    /**
     * 绘图句柄
     * @type {ol.interaction.Draw}
     */
    this.draw = null;

    /**
     * 要素的地理要素变化监听句柄
     * @type {String}
     */
    this.listener = null;

    /**
     * wgs84椭球对象
     * @type {ol.Sphere}
     */
    this.wgs84Sphere = new ol.Sphere(6378137);

    /**
     * 关闭按钮
     * @type {ol.Overlay}
     */
    this.closeBtn = null;

    this.init();
};
goog.inherits(Ez.utility.Measure, ol.Object);

/**
 * 工具类初始化需要添加的事件以及图层操作
 */
Ez.utility.Measure.prototype.init = function() {
    var map = this.map_;

    //抓取vector图层
    var markerLayers = map.getMarkerLayers();
    var vectorLayer;
    markerLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'marker_default') {
            vectorLayer = /** @type {ol.layer.Vector} */ (ele);
        }
    });

    if (vectorLayer) {
        this.vectorLayer = vectorLayer;
    } else {
        throw new Error("不能获取到默认的marker图层");
    }

    //初始化绘图交互工具
    this.draw = this.createInteraction(this.type);
    map.addInteraction(this.draw);
    //初始化帮助提示元素
    this.createHelpTooltip();
    //初始化测量提示元素
    this.createMeasureTooltip();

    //绘制过程事件监听
    this.draw.once("drawstart", this.onStartDraw, this);
    this.draw.once("drawend", this.onEndDraw, this);

    map.on('pointermove', this.handlePointerMove, this);
    map.getViewport().addEventListener('mouseout', function(evt) {
        Ez.utility.Measure.addClass(this.helpTooltipElement, 'hidden');
    }.bind(this));
};

Ez.utility.Measure.prototype.de_init = function() {
    var map = this.map_;

    map.removeInteraction(this.draw);

    // 移除init的Dom元素
    map.removeOverlay(this.helpTooltip, true);
    map.removeOverlay(this.measureTooltip, true);


    //取消绘制过程事件监听
    this.draw.un("drawstart", this.onStartDraw, this);
    this.draw.un("drawend", this.onEndDraw, this);

    map.un('pointermove', this.handlePointerMove, this);
    map.getViewport().removeEventListener('mouseout', function(evt) {
        Ez.utility.Measure.addClass(this.helpTooltipElement, 'hidden');
    }.bind(this));
};

Ez.utility.Measure.prototype.disposeAll = function() {
    var vectorLayer = this.vectorLayer;
    var vectorSource = vectorLayer.getSource();

    if (this.waitSketch) {
        vectorSource.removeFeature(this.waitSketch);
        this.waitSketch = null;
    }

    var map = this.map_;

    map.removeOverlay(this.measureTooltip, true);
    map.removeOverlay(this.HelpTooltip, true);
    map.removeOverlay(this.closeBtn, true);
};

/**
 * 提供指针移动相关处理方法
 * @param  {ol.MapBrowserEvent} evt
 */
Ez.utility.Measure.prototype.handlePointerMove = function(evt) {
    if (evt.dragging) {
        return;
    }

    /** @type {String} */
    var helpMsg = "点击开始绘制与测量";

    if (this.sketch) {
        var sketch = this.sketch;
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = this.continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = this.continueLineMsg;
        }
    }

    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);

    Ez.utility.Measure.addClass(this.helpTooltipElement, "hidden");
};

/**
 * 配置相关绘图样式
 */
Ez.utility.Measure.prototype.createInteraction = function(type) {
    var draw = new ol.interaction.Draw2({
        source: this.vectorLayer.getSource(),
        type: /** @type {ol.geom.GeometryType} */ (type),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(67, 78, 255, 0.3)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(67, 78, 255, 0.8)',
                width: 2
            })
        }),
        tip: false
    });
    return draw;
};

/**
 * 开始绘制事件处理函数
 * @param  {ol.interaction.DrawEvent} evt
 */
Ez.utility.Measure.prototype.onStartDraw = function(evt) {
    // set sketch
    var sketch = this.sketch = evt.feature;

    /** @type {ol.Coordinate|undefined} */
    var tooltipCoord = evt.coordinate;

    listener = sketch.getGeometry().on('change', function(evt) {
        var geom = evt.target;
        var output;
        if (geom instanceof ol.geom.Polygon) {
            output = this.formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof ol.geom.LineString) {
            output = this.formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
        }
        this.measureTooltipElement.innerHTML = output;
        this.measureTooltip.setPosition(tooltipCoord);
    }, this);
};

/**
 * 结束绘制事件处理函数
 * @param  {ol.interaction.DrawEvent} evt
 */
Ez.utility.Measure.prototype.onEndDraw = function(evt) {
    this.measureTooltipElement.className = 'tooltip tooltip-static';
    this.measureTooltip.setOffset([0, -7]);
    // unset sketch
    this.sketch.setStyle(this.sketchStyle);
    // unset tooltip so that a new one can be created
    this.measureTooltipElement = null;
    //执行用户的回调函数
    this.fn_(this.callbackData);
    //创建关闭按钮并绑定监听
    this.createCloseBtn();
    //ol.interaction.Draw2需要自己在回调中增加
    var feature = evt.feature;
    this.vectorLayer.getSource().addFeature(feature);

    this.waitSketch = this.sketch;
    this.sketch = null;
    //移除交互
    this.deleteHandleOfMeasure();
};

Ez.utility.Measure.prototype.createCloseBtn = function() {
    var element = document.createElement('div');
    element.className = "close";

    this.closeBtn = new ol.Overlay({
        element: element,
        offset: [0, 5],
        positioning: 'top-center'
    });
    var map = this.map_;
    map.addOverlay(this.closeBtn, true);

    var sketch = this.sketch;
    var geom = sketch.getGeometry();
    var pos;
    if (geom instanceof ol.geom.LineString) {
        pos = geom.getLastCoordinate();
    } else if (geom instanceof ol.geom.Polygon) {
        pos = geom.getInteriorPoint().getCoordinates();
    }
    this.closeBtn.setPosition(pos);

    //定义点击按钮后的处理函数
    element.addEventListener('click', function() {
        this.disposeAll();
    }.bind(this));
};

/**
 * 移除与绘图和测量相关的事件
 * @return {[type]} [description]
 */
Ez.utility.Measure.prototype.deleteHandleOfMeasure = function() {
    var map = this.map_;

    //移除Help提示要素
    map.removeOverlay(this.helpTooltip, true);

    //移除要素变化的事件处理函数
    this.unByKey(this.listener);

    //移除绘制句柄
    map.removeInteraction(this.draw);
    this.draw = null;

    map.un('pointermove', this.handlePointerMove, this);
    map.getViewport().removeEventListener('mouseout', function(evt) {
        Ez.utility.Measure.addClass(this.helpTooltipElement, 'hidden');
    }.bind(this));
};

/**
 * 创建测量工具提示框
 */
Ez.utility.Measure.prototype.createMeasureTooltip = function() {
    if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    this.measureTooltip = new ol.Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    var map = this.map_;
    map.addOverlay(this.measureTooltip, true);
}

/**
 * 创建帮助提示工具
 */
Ez.utility.Measure.prototype.createHelpTooltip = function() {
    if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip hidden';
    this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    var map = this.map_;
    map.addOverlay(this.helpTooltip, true);
};

/**
 * 格式化长度输出
 * @param  {ol.gemo.Polygon} polygon
 * @return {String}
 */
Ez.utility.Measure.prototype.formatArea = function(polygon) {
    var area;
    var sourceProj = this.map_.getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */ (polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    area = Math.abs(this.wgs84Sphere.geodesicArea(coordinates));

    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }

    this.callbackData = {
        value: area,
        pretty: output
    }

    return output;
};

/**
 * 格式化线段长度输出
 * @param  {ol.gemo.LineString} line
 * @return {String}
 */
Ez.utility.Measure.prototype.formatLength = function(line) {
    var length;
    var coordinates = line.getCoordinates();
    length = 0;
    var sourceProj = this.map_.getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += this.wgs84Sphere.haversineDistance(c1, c2);
    }

    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }

    this.callbackData = {
        value: length,
        pretty: output
    }

    return output;
};

/**
 * 工具函数用于增加CLASS
 * @param {Element} element - 目标要素
 * @param {String} cls - className
 */
Ez.utility.Measure.addClass = function(element, cls) {
    var joinStr = " " + cls.trim();
    element.className += joinStr;
};

Ez.utility.Measure.removeClass = function(element, cls) {
    var classnames = element.className;
    var clsArr = classnames.split(' ');
    for (var i = 0; i < clsArr.length; i++) {
        if (clsArr[i] === cls) {
            clsArr[i] = '';
            break;
        }
    }
    var newClassName = clsArr.join(" ");
    element.className = newClassName;
};
