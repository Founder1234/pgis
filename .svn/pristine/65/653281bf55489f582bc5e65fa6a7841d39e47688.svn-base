/*
|------------------------------------------------------------------------------
|                                Ez.Popup                
|
|@author: qianleyi
|@date: 2016-01-22
|@descript: 重构Ez.Popup类，提供自定义样式接口，解决open是marker颤抖BUG
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Popup');

goog.require('Ez.Map');
goog.require('ol.Overlay');
goog.require('ol.animation');

Ez.Popup = function(opt_options) {

    var options = opt_options || {};

    var customStyle = goog.isDef(options.customStyle) ? options.customStyle : 'ez-popup';
    var stopEvent = !options.stopEvent ? false : true;
    var offsetY = options.offsetY || 0;
    var offsetX = options.offsetX || 0;

    goog.base(this, {
        element: this.container,
        autoPan: false,
        positioning: 'bottom-center',
        stopEvent: stopEvent,
        offset: [offsetX, offsetY]
    });

    this.isDefaultStyle = !goog.isDef(options.customStyle);

    this.container = document.createElement('div');
    this.container.className = customStyle;
};

goog.inherits(Ez.Popup, ol.Overlay);

/**
 * 增加popup到地图
 * @param  {Ez.Map} map 
 */
Ez.Popup.prototype.onAdd = function(map) {
    this.map_ = map;
};

/**
 * 移除popup从地图
 * @param  {Ez.Map} map
 */
Ez.Popup.prototype.onRemove = function(map) {
    this.map_ = null;
};

/**
 * 关闭POPUP
 */
Ez.Popup.prototype.close = function() {
    this.container.style.display = "none";
    this.container.innerHTML = '';
};

/**
 * Show the popup.
 * @param {Ez.Coordinate} coord Where to anchor the popup.
 * @param {String} html String of HTML to display within the popup.
 */
Ez.Popup.prototype.show = function(html, coord) {
    this.container.innerHTML = '';
    if (coord instanceof Ez.Coordinate) {
        this.setPosition(coord.getCoordinate());
    } else {
        this.setPosition(coord);
    }
    if (this.isDefaultStyle) {
        var closer = document.createElement('a');
        closer.className = 'ez-popup-closer';
        closer.href = '#';
        this.container.appendChild(closer);
        var that = this;
        closer.addEventListener("click", function(evt) {
            evt.stopPropagation();
            that.close();
            this.blur();
        });

        this.content = document.createElement('div');
        this.content.className = 'ez-popup-content';
        this.content.innerHTML = html;
        this.container.appendChild(this.content);
    } else {
        this.container.innerHTML = html;
    }
    this.container.style.display = 'block';

    var divWidth = this.getElement().clientWidth;
    this.container.style.left = (-divWidth / 2) + 'px';

    return this;
};

/**
 * 更新popup内容
 * @param {string} str
 */
Ez.Popup.prototype.setContent = function(str) {
    if (this.isDefaultStyle) {
        this.content.innerHTML = str;
    } else {
        this.container.innerHTML = str;
    }
};

/**
 * @private
 * @desc Determine if the current browser supports touch events. Adapted from
 * https://gist.github.com/chrismbarr/4107472
 */
Ez.Popup.isTouchDevice_ = function() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * @private
 * @desc Apply workaround to enable scrolling of overflowing content within an
 * element. Adapted from https://gist.github.com/chrismbarr/4107472
 */
Ez.Popup.enableTouchScroll_ = function(elm) {
    if (Ez.Popup.isTouchDevice_()) {
        var scrollStartPos = 0;
        elm.addEventListener("touchstart", function(event) {
            scrollStartPos = this.scrollTop + event.touches[0].pageY;
        }, false);
        elm.addEventListener("touchmove", function(event) {
            this.scrollTop = scrollStartPos - event.touches[0].pageY;
        }, false);
    }
};

/**
 * Hide the popup.
 */
Ez.Popup.prototype.hide = function() {
    this.container.style.display = 'none';
    return this;
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzPopup', Ez.Popup);
