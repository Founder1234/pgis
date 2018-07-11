/*
|------------------------------------------------------------------------------
|                               ol.extern.Echarts               
|
|@author: qianleyi
|@date: 2015-12-28
|@descript: 扩展类用于显示ECharts类
|------------------------------------------------------------------------------
*/
goog.provide('ol.extern.Echarts');

goog.require('ol.extern.Extern');

/**
 * ol3 overlay 扩展图层，用于显示ECharts图表
 * @contructor
 * @param {Object} options
 * @extends {ol.extern.Extern}
 */
ol.extern.Echarts = function(options) {

    var opts = goog.isDef(options) ? options : {};

    var element = document.createElement('div');

    /**
     * Echarts实例对象
     * @type {Echarts}
     */
    this._ecClass = goog.isDef(opts.echarts) ? opts.echarts : null;
    this._ec = null;

    this._map = null;

    this._enableDrag = true;

    this._geoCoord = [];

    this._mapOffset = [0, 0];

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

ol.extern.Echarts.prototype.handleEvent = function(mapBrowserEvent) {};

ol.extern.Echarts.prototype.addMarkWrap = function() {
    this.addMarkWrap_();
};

ol.extern.Echarts.prototype.bindEvent = function() {
    var map = this.getMap();
    var view = map.getView();

    var zoomKey = view.on('change:resolution', this.zoomChangeHandler_, this);
    this.listenerKeys.push(zoomKey);
    // var movingKey = view.on('change:center',this.moveHandler_,this);
    // this.listenerKeys.push(movingKey);
    var moveendKey = map.on('moveend', this.moveHandler_, this);
    this.listenerKeys.push(moveendKey);

    this._ec.getZrender().on('mouseover', _dragZrenderHandler);
    this._ec.getZrender().on('mouseout', _dragZrenderHandler);

    var interactions = map.getInteractions();
    this._interactionPan = null;
    var self = this;
    interactions.forEach(function(val) {
        if (val instanceof ol.interaction.DragPan) {
            self._interactionPan = val;
        }
    });

    function _dragZrenderHandler(evt) {
        if (evt.type === 'mouseover') {
            self._interactionPan.setActive(false);
        } else if (evt.type === 'mouseout') {
            self._interactionPan.setActive(true);
        }

    }

    var mapBrowserEventHandler = new ol.MapBrowserEventHandler(map);
    ol.events.listen(mapBrowserEventHandler,
        goog.object.getValues(ol.MapBrowserEvent.EventType),
        this.handleMapBrowserEvent, false, this);
    this.registerDisposable(mapBrowserEventHandler);
};

ol.extern.Echarts.prototype.handleMapBrowserEvent = function(mapBrowserEvent) {
    if (goog.isNull(this.frameState_)) {
        // With no view defined, we cannot translate pixels into geographical
        // coordinates so interactions cannot be used.
        return;
    }
    this.handleEvent(mapBrowserEvent);
};

ol.extern.Echarts.prototype.moveHandler_ = function(e) {
    var self = this;
    // 记录偏移量
    var offsetEle =
        self.element.parentNode.parentNode.parentNode;
    self._mapOffset = [-parseInt(offsetEle.style.left) || 0, -parseInt(offsetEle.style.top) || 0];
    self.element.style.left = self._mapOffset[0] + 'px';
    self.element.style.top = self._mapOffset[1] + 'px';
    if (!this.option_) {
        return;
    }
    self.refresh();
};

ol.extern.Echarts.prototype.zoomChangeHandler_ = function(e) {
    this.refresh();
};

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

ol.extern.Echarts.prototype.setOption = function(option, notMerge) {
    this.option_ = option;
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

ol.extern.Echarts.prototype._AddPos = function(obj) {
    var coord = this._geoCoord[obj.name];
    var pos = this.geoCoord2Pixel(coord);
    obj.x = pos[0] - this._mapOffset[0];
    obj.y = pos[1] - this._mapOffset[1];
};

ol.extern.Echarts.prototype.geoCoord2Pixel = function(coord) {
    var map = this.getMap();
    var pos = map.getPixelFromCoordinate(coord);
    return pos;
};
