/*
|------------------------------------------------------------------------------
|                               ol.extern.Echarts               
|
|@author: qianleyi
|@date: 2016.1.18
|@descript: 扩展用于显示Echarts类
|------------------------------------------------------------------------------
*/
goog.provide('ol.extern.Echarts');

goog.require('ol.extern.Extern');

/**
 * @classdesc
 * ol3 overlay 扩展图层，用于显示ECharts图表
 *
 * @contructor
 * @param {Object} options
 * @extends {ol.extern.Extern}
 */
ol.extern.Echarts = function(options) {

    var opts = goog.isDef(options) ? options : {};

    var element = document.createElement('div');

    /**
     * Echarts类引用
     * @type {Echarts}
     * @private
     */
    this._ecClass = goog.isDef(opts.echarts) ? opts.echarts : null;

    /**
     * Echarts类实例
     * @type {Echarts}
     * @private
     */
    this._ec = null;

    /**
     * Ez.Map类对象
     * @type {Ez.Map}
     * @private
     */
    this._map = null;

    /**
     * geoCoord
     * @type {Array}
     * @private
     */
    this._geoCoord = [];

    /**
     * 记录偏移量
     * @type {Array}
     * @private
     */
    this._mapOffset = [0, 0];

    /**
     * 是否设置Option
     * @type {Boolean}
     * @private
     */
    this._first = false;

    /**
     * 地图的平移交互接口
     * @type {ol.interaction.DragPan}
     * @private
     */
    this._mapDragPanInteraction = null;

    ol.extern.Extern.call(this, {
        element: element
    });
};
goog.inherits(ol.extern.Echarts, ol.extern.Extern);

/**
 * onAdd方法
 * @param  {Ez.Map} map [description]
 * @return {[type]}     [description]
 */
ol.extern.Echarts.prototype.onAdd = function(map) {
    this.setMap(map);
    this._map = map;

    /**
     * 设置element的宽和高
     */
    var size = map.getSize();
    this.element.style.width = size[0] + 'px';
    this.element.style.height = size[1] + 'px';

    this.element.style.position = 'absolute';
    this.element.style.top = 0;
    this.element.style.left = 0;

    this._ec = this._ecClass.init.apply(this, [this.element]);

    /**
     * bind 地图移动事件处理
     */
    this.bindEvent();
};

/**
 * 绑定地图事件
 * @private
 */
ol.extern.Echarts.prototype.bindEvent = function() {
    var map = this.getMap();
    var view = map.getView();

    if (!this._mapDragPanInteraction) {
        var interactions = map.getInteractions();
        interactions.forEach(function(val) {
            if (val instanceof ol.interaction.DragPan) {
                this._mapDragPanInteraction = val;
            }
        }, this);
    }

    var zoomKey = view.on('change:resolution', this.zoomChangeHandler_, this);
    this.listenerKeys.push(zoomKey);
    var moveendKey = map.on('moveend', this.moveHandler_, this);
    this.listenerKeys.push(moveendKey);

    this._ec.getZrender().on('mouseover', _dragZrenderHandler);
    this._ec.getZrender().on('mouseout', _dragZrenderHandler);

    var self = this;

    function _dragZrenderHandler(evt) {
        if (!self._mapDragPanInteraction) {
            return; }

        if (evt.type === 'mouseover') {
            self._mapDragPanInteraction.setActive(false);
        } else if (evt.type === 'mouseout') {
            self._mapDragPanInteraction.setActive(true);
        }

    }

    // var mapBrowserEventHandler = new ol.MapBrowserEventHandler(map);
    // goog.events.listen(mapBrowserEventHandler,
    //   goog.object.getValues(ol.MapBrowserEvent.EventType),
    //   this.handleMapBrowserEvent, false, this);
    // this.registerDisposable(mapBrowserEventHandler);
};

/**
 * 分发地图浏览器事件
 * @param  {ol.MapBrowserEvent} mapBrowserEvent
 * @private  
 */
ol.extern.Echarts.prototype.handleMapBrowserEvent = function(mapBrowserEvent) {
    if (goog.isNull(this.frameState_)) {
        // With no view defined, we cannot translate pixels into geographical
        // coordinates so interactions cannot be used.
        return;
    }
    this.handleEvent(mapBrowserEvent);
};

/**
 * 通过浏览器事件类型做相应处理
 * @param  {ol.MapBrowserEvent} mapBrowserEvent
 * @private
 */
ol.extern.Echarts.prototype.handleEvent = function(mapBrowserEvent) {

};

/**
 * zoom级别变化事件处理
 * @param  {[type]} e [description]
 */
ol.extern.Echarts.prototype.zoomChangeHandler_ = function(e) {
    this.refresh();
};

/**
 * 地图拖动事件处理
 * @param  {[type]} e [description]
 */
ol.extern.Echarts.prototype.moveHandler_ = function(e) {
    // 记录偏移量
    var offsetEle =
        this.element.parentNode.parentNode.parentNode;
    this._mapOffset = [-parseInt(offsetEle.style.left) || 0, -parseInt(offsetEle.style.top) || 0];
    this.element.style.left = this._mapOffset[0] + 'px';
    this.element.style.top = this._mapOffset[1] + 'px';

    if (this._first) {
        this.refresh();
    }
};

/**
 * 地理坐标转像素坐标方法
 * @param  {ol.Coordinate} coord
 * @return {ol.Pixel}
 */
ol.extern.Echarts.prototype.geoCoord2Pixel = function(coord) {
    var map = this.getMap();
    var pos = map.getPixelFromCoordinate(coord);
    return pos;
};

/**
 * 增加地理坐标
 * @param  {Object} obj
 * @private
 */
ol.extern.Echarts.prototype._AddPos = function(obj) {
    var coord = this._geoCoord[obj.name];
    var pos = this.geoCoord2Pixel(coord);
    obj.x = pos[0] - this._mapOffset[0];
    obj.y = pos[1] - this._mapOffset[1];
};

/**
 * 更新zrender界面
 */
ol.extern.Echarts.prototype.refresh = function() {
    if (this._ec) {
        var option = this._ec.getOption();
        var component = this._ec.component || {};
        var legend = component.legend;
        var dataRange = component.dataRange;

        if (legend) {
            option.legend.selected = legend.getSelectedMap();
        }

        if (dataRange) {
            option.dataRange.range = dataRange._range;
        }
        this._ec.clear();
        this.setOption(option);
        this.getMap().render();
    }
};

/**
 * Echarts方法用于增加MarkWrap
 * @private
 */
ol.extern.Echarts.prototype.addMarkWrap_ = function() {
    function _addMark(seriesIdx, markData, markType) {
        var data;
        if (markType == 'markPoint') {
            var data = markData.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    this._AddPos(data[k]);
                }
            }
        } else {
            data = markData.data;
            if (data && data.length) {
                for (var k = 0, len = data.length; k < len; k++) {
                    this._AddPos(data[k][0]);
                    this._AddPos(data[k][1]);
                }
            }
        }
        this._ec._addMarkOri(seriesIdx, markData, markType);
    }
    this._ec._addMarkOri = this._ec._addMark;
    this._ec._addMark = _addMark;
};

/**
 * 设置属性，定义要显示的数据等等
 * @param {Object} option
 * @param {[type]} notMerge [description]
 * @api
 */
ol.extern.Echarts.prototype.setOption = function(option, notMerge) {
    this._first = true;

    var series = option.series || {};

    // 记录所有的geoCoord
    for (var i = 0, item; item = series[i++];) {
        var geoCoord = item.geoCoord;
        if (geoCoord) {
            for (var k in geoCoord) {
                this._geoCoord[k] = geoCoord[k];
            }
        }
    }

    // 添加x、y
    for (var i = 0, item; item = series[i++];) {
        var markPoint = item.markPoint || {};
        var markLine = item.markLine || {};

        var data = markPoint.data;
        if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
                this._AddPos(data[k]);
            }
        }

        data = markLine.data;
        if (data && data.length) {
            for (var k = 0, len = data.length; k < len; k++) {
                this._AddPos(data[k][0]);
                this._AddPos(data[k][1]);
            }
        }
    }

    this._ec.setOption(option, notMerge);
};
