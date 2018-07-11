/*
|------------------------------------------------------------------------------
|                               Ez.Marker.js                
|
|@author: qianleyi
|@date: 2015-12-17
|@descript: marker地图叠加要素类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Marker');
goog.provide('Ez.MarkerDragEvent');

goog.require('Ez.Coordinate');
goog.require('Ez.Event');
goog.require('Ez.Overlay');
goog.require('ol.geom.Point');
goog.require('ol.style.Style');
goog.require('ol.style.Icon');
goog.require('ol.style.Text');

/**
 * 可拖拽Marker的DragEvent
 * @param {String} type 
 */
Ez.MarkerDragEvent = function(type) {
    goog.base(this, type);
};
goog.inherits(Ez.MarkerDragEvent, ol.events.Event);

/**
 * Ez.Marker 对象类
 * @param {!Ez.Coordinate} [coordinate]
 * @param {Ez.Icon|ol.style.Icon|undefined} [icon] 
 * @param {string|undefined=} title
 * @param {Object} 其他属性
 * @extends {Ez.Overlay} 
 * @constructor
 */
Ez.Marker = function(coordinate, icon, title, options) {
    //样式对象
    var markerStyle;
    //默认marker样式
    if (goog.isDef(icon)) {
        markerStyle = new ol.style.Style({
            image: icon
        });
    } else {
        markerStyle = new ol.style.Style({
            image: new ol.style.Icon({
                src: '../images/marker-icon.png',
                anchor: [0.5, 1],
                anchorXUnits: ol.style.IconAnchorUnits.FRACTION,
                anchorYUnits: ol.style.IconAnchorUnits.FRACTION,
                size: [25, 41],
                opacity: 1
            })
        });
    }

    /**把Ez.Coordinate对象类转换为ol.Coordinates*/
    this.coordinatesOfEz_ = coordinate;
    this.coordinatesOfOl_ = coordinate.getCoordinate();
    this.map_ = null;

    /**定义传入参数*/
    var markerOptions = {
        geometry: new ol.geom.Point(this.coordinatesOfOl_)
    };

    goog.base(this, markerOptions);

    /** @type {Ez.title} */
    this.title_ = goog.isDef(title) ? title : null;
    this.isTitleOnMap = false;
    this.isTitleInited = false;

    this.anchorImg_ = this.set("coordinate", this.coordinatesOfOl_);
    this.set('markerStyle', markerStyle);

    this.setStyle(markerStyle);

    //增加类型标识，用于地图打印服务
    this.markerFlag = true;

    /** 添加其他属性 */
    var opts = options || {};
    if (opts.draggable) {
        this.set('draggable', opts.draggable);
    }
};
goog.inherits(Ez.Marker, Ez.Overlay);

/**
 * onAdd方法
 * @param {Ez.Map} map 地图对象
 */
Ez.Marker.prototype.onAdd = function(map) {
    this.map_ = map;
    //default marker 图层
    var markerLayers = map.getMarkerLayers();
    var markerEle = this;
    markerLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'marker_default') {
            var markerlayer = /** @type {ol.layer.Vector} */ (ele);
            markerlayer.getSource().addFeature(markerEle);
        }
    });
    this.set('isAddToMap', true);
};

/**
 * onRemove方法
 * @param {Ez.Map} map 地图对象
 */
Ez.Marker.prototype.onRemove = function(map) {
    if (!this.get('isAddToMap')) return;

    if (this.title_ && this.isTitleOnMap) {
        this.hideTitle();
    }

    this.map_ = null;
    //default marker 图层
    var markerLayers = map.getMarkerLayers();
    var markerEle = this;

    markerLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'marker_default') {
            var markerlayer = /** @type {ol.layer.Vector} */ (ele);
            markerlayer.getSource().removeFeature(markerEle);
        }
    });
    this.set('isAddToMap', false);
};

/**
 * 显示当前要素
 */
Ez.Marker.prototype.show = function() {
    this.setOpacity(this.opac_ ? this.opac_ : this.getOpacity());
    delete this.opac_;
    if (this.isTitleOnMap) {
        if (!this.title_.isShow) {
            this.title_.show();
        }
    }
};

/**
 * 隐藏当前要素
 */
Ez.Marker.prototype.hide = function() {
    this.opac_ = this.getOpacity();
    this.setOpacity(0);
    if (this.isTitleOnMap) {
        this.title_.hide();
    }
};

/**
 * 获取Marker的坐标位置
 * @return {Ez.Coordinate} 返回Ez.Coordinate对象
 */
Ez.Marker.prototype.getPoint = function() {
    var ol_Coor = this.getGeometry().getCoordinates();
    return new Ez.Coordinate(ol_Coor[0], ol_Coor[1]);
};

/**
 * 设置Popup的位置
 * @param {Ez.Coordinate} point Ez.Coordinate对象
 * @return {Ez.Marker} marker Ez.Marker 对象本身
 */
Ez.Marker.prototype.setPoint = function(point) {
    this.coordinatesOfEz_ = point;
    var coord_ = point.getCoordinate();
    this.coordinatesOfOl_ = coord_;
    this.getGeometry().setCoordinates(coord_);
    this.set("coordinate", coord_);
    return this;
};

/**
 * 设置Marker的透明度
 * @param {number} opacity 
 */
Ez.Marker.prototype.setOpacity = function(opacity) {
    var markerStyle = this.getStyle();
    markerStyle.getImage().setOpacity(opacity);
    this.setStyle(markerStyle);
};

Ez.Marker.prototype.getOpacity = function() {
    return this.getStyle().getImage().getOpacity();
};

Ez.Marker.prototype.getRotate = function() {
    return this.getStyle().getImage().getRotation();
};

/**
 * 打开popup
 * @param  {Ez.Popup | string} strHtml 
 */
Ez.Marker.prototype.openInfoWindow = function(strHtml, options) {
    var position = this.getGeometry().getCoordinates();

    var opts = options ? options : {};

    var popupOpts = {};

    for (var opt in opts) {
        popupOpts[opt] = opts[opt];
    }

    /** 获取marker的icon */
    var size = this.getStyle().getImage().getSize();
    size = size ? size : [25, 41];
    var scale = this.getStyle().getImage().getScale();
    scale = scale ? scale : 1;

    popupOpts['offsetX'] = 0;
    popupOpts['offsetY'] = -(size[1] * scale + 5);
    if (this.popup_) {
        this.map_.removeOverlay(this.popup_);
        this.popup_ = null;
    }
    this.popup_ = new Ez.Popup(popupOpts);
    this.map_.addOverlay(this.popup_);
    this.popup_.show(strHtml, position);
};

/**
 * 关闭popup
 */
Ez.Marker.prototype.closeInfoWindow = function() {
    if (!this.popup_) {
        return;
    }

    this.map_.removeoverlay(this.popup_);
    this.popup_ = null;
};

/**
 * 处理marker属性改变时的Title位置变化
 * @private
 */
Ez.Marker.prototype.handleChange_ = function() {
    var pos = this.getGeometry().getCoordinates();
    this.title_.setPosition(pos);
};

/**
 * 在地图渲染完成时配置Title坐标参数
 * @private
 */
Ez.Marker.prototype.handleOnLoad_ = function() {
    this.handleChange_();
    this.map_.addOverlay(this.title_);
};

/**
 * override Ez.Overlay.prototype.handleTitleInit_
 * @return {[type]} [description]
 */
Ez.Marker.prototype.handleTitleInit_ = function() {
    var coords = this.getPoint();
    this.title_.setPosition(coords);
    this.map_.addOverlay(this.title_);
    this.isTitleInited = true;
};

/**
 * 获取图片元素
 * @return {Element}
 */
Ez.Marker.prototype.getImage = function() {
    var style = this.getStyle();
    return style.getImage().getImage();
};

/**
 * 获取Marker的Icon对象
 * @return {Ez.Icon}
 */
Ez.Marker.prototype.getIcon = function() {
    return this.getStyle().getImage();
};

/**
 * 设置Marker的Icon对象
 * @param {Ez.Icon} icon
 */
Ez.Marker.prototype.setIcon = function(icon, isRender) {
    var style = this.getStyle();
    var newStyle = new ol.style.Style({
        image: icon
    });
    this.setStyle(newStyle);
    if (!isRender) {
        this.changed();
    }
};

/**
 * 要素flash
 * @param  {Object} options 参数配置
 */
Ez.Marker.prototype.flash = function(options) {
    var opts = options ? options : {};

    //定义闪烁的持续时间
    var duration = opts['duration'] ? opts['duration'] : 3000;
    var times = opts['times'] ? opts['times'] : 3;

    //保存要素样式，隐藏要素
    this.hide();
    var icon = this.getIcon();

    if (!this.map_) return;

    var start = new Date().getTime();
    var firstTime = new Date(start);
    var listenerKey;
    var self = this;

    function animating(event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        var elapsed = frameState.time - start;
        var v = elapsed / parseFloat(duration / times);

        var style = new ol.style.Style({
            image: icon
        });

        var rv = v % 1;
        if (rv < 0.3 || rv > 0.6) {
            icon.setOpacity(1);
        } else {
            icon.setOpacity(0);
        }

        vectorContext.drawFeature(self.clone(), style);

        if (v > times) {
            ol.Observable.unByKey(listenerKey);
            map.render();
            self.show();
            return;
        }
        // tell OL3 to continue postcompose animation
        map.render();
    }
    listenerKey = map.on('postcompose', animating);
    map.render();
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzMarker', Ez.Marker);
