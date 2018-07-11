/*
|------------------------------------------------------------------------------
|                               Ez.HTMLElementOverLay.js                
|
|@author: qianleyi
|@date: 2015-12-15
|@descript: 地图添加自定义HTML要素类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.HTMLElementOverLay');

goog.require('ol.Overlay');

/**
 * 像地图添加自定义HTML叠加要素类
 * @classdesc
 * 由于该地图客户端使用CANVAS进行地图渲染，所以，HTMLElmentOverLay对象设置的id
 * 等属性都会设置到一个程序生成的DIV中，strHTML的值会转换为DOM追加到程序生成的
 * DIV元素中
 * @param {String} id              [description]
 * @param {Ez.Coordinate|ol.Coordinate} LeftTopMapPoint [description]
 * @param {String} strHTML         [description]
 */
Ez.HTMLElementOverLay = function(id, LeftTopMapPoint, strHTML, offset, positioning, stopEvent) {
    var divelement = document.createElement('div');
    divelement.id = id;
    divelement.innerHTML = strHTML;

    var position;
    if (LeftTopMapPoint instanceof Ez.Coordinate) {
        position = LeftTopMapPoint.getCoordinate();
    } else if (goog.isArray(LeftTopMapPoint)) {
        position = LeftTopMapPoint;
    } else {
        goog.asserts.assert(false, '请传入坐标数组或者EzCoord对象');
    }

    var stopEvent = goog.isDef(stopEvent) ? stopEvent : true;
    var offsetObj = goog.isDef(offset) ? offset : [0, 0];
    var positioningObj = goog.isDef(positioning) ? positioning : 'top-left';

    ol.Overlay.call(this, {
        stopEvent: stopEvent,
        element: divelement,
        offset: offsetObj,
        positioning: positioningObj,
        position: position
    });

    //增加类型标识，用于地图打印服务
    this.htmlelementoverlayFlag = true;
};
goog.inherits(Ez.HTMLElementOverLay, ol.Overlay);

/**
 * 增加popup到地图
 * @param  {Ez.Map} map 
 */
Ez.HTMLElementOverLay.prototype.onAdd = function(map) {
    this.map_ = map;
};

/**
 * 移除popup从地图
 * @param  {Ez.Map} map
 */
Ez.HTMLElementOverLay.prototype.onRemove = function(map) {
    this.map_ = null;
};

/**
 * 显示HtmlElementOverlay
 */
Ez.HTMLElementOverLay.prototype.show = function() {
    this.getElement().style.display = 'block';
};

/**
 * 隐藏HtmlElementOverlay
 */
Ez.HTMLElementOverLay.prototype.hide = function() {
    this.getElement().style.display = 'none';
};

/**
 * 设置地图叠加要素的地图显示位置
 * @param {Ez.Coordinate | Array<Float,Float>} newpos [description]
 */
Ez.HTMLElementOverLay.prototype.setPos = function(newpos) {
    var position;
    if (newpos instanceof Ez.Coordinate) {
        position = newpos.getCoordinate();
    } else if (goog.isArray(newpos)) {
        position = newpos;
    } else {
        goog.asserts.assert(false, '请传入坐标数组或者EzCoord对象');
    }

    this.setPosition(position);
};

/**
 * 获取地图叠加要素的地理位置
 * @param  {Boolean} isArray 缺省或者false则返回EzCoord对象，反之，则返回Array
 * @return {[type]}          [description]
 */
Ez.HTMLElementOverLay.prototype.getPos = function(isArray) {
    var position = this.getPosition();

    if (goog.isDef(isArray) && isArray) {
        return position;
    } else {
        return new Ez.Coordinate(position[0], position[1]);
    }
};

/**
 * 在HTMLElementOverLay对象中打开一个InfoWindow
 * @param  {Ez.Coordinate | Array.<number,number>} coordinate
 * @param  {string} strHTML
 */
Ez.HTMLElementOverLay.prototype.openInfoWindow = function(strHTML, coordinate, options) {
    var coords;
    if (coordinate instanceof Ez.Coordinate) {
        coords = coordinate.getCoordinate();
    } else if (goog.isArray(coordinate)) {
        coords = coordinate;
    } else {
        goog.asserts.assert(false, '请传入坐标数组或者EzCoord对象');
    }

    if (!this.popup_) {
        if (strHTML instanceof Ez.Popup) {
            this.popup_ = strHTML;
        } else {
            this.popup_ = new Ez.Popup(options);
        }
        this.map_.addOverlay(this.popup_);
    }
    this.popup_.show(coords, strHTML);
};

/**
 * 关闭InfoWindow
 * @return {[type]} [description]
 */
Ez.HTMLElementOverLay.prototype.closeInfoWindow = function() {
    if (!this.popup_) {
        return;
    }

    this.map_.removeOverlay(this.popup_);
    this.popup_ = null;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('HTMLElementOverLay', Ez.HTMLElementOverLay);
