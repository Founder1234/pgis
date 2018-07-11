/*
|------------------------------------------------------------------------------
|                               Ez.Popup2               
|
|@author: qianleyi
|@date: 2016-05-05
|@descript: Ez.Popup存在初始化popup弹出的位置错误问题，现更新Ez.Popup2来解决该问题。后续会抛弃Ez.Popup
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Popup');
goog.provide('Ez.PopupEvent');

goog.require('Ez.Map');
goog.require('ol.Overlay');
goog.require('ol.animation');

/**
 * Popup打开和关闭的事件
 * @param {String} type
 */
Ez.PopupEvent = function(type) {
    goog.base(this, type);
};
goog.inherits(Ez.PopupEvent, ol.events.Event);

/**
 * Popup 类
 * @param {[type]} opt_options [description]
 */
Ez.Popup = function(opt_options) {

    var options = opt_options || {};

    var customStyle = goog.isDef(options.customStyle) ? options.customStyle : 'ez-popup';
    var offsetY = options.offsetY || 0;
    var offsetX = options.offsetX || 0;

    this.panMapIfOutOfView = options.panMapIfOutOfView;
    if (this.panMapIfOutOfView === undefined) {
        this.panMapIfOutOfView = true;
    }

    this.ani = options.ani;
    if (this.ani === undefined) {
        this.ani = ol.animation.pan;
    }

    this.ani_opts = options.ani_opts;
    if (this.ani_opts === undefined) {
        this.ani_opts = { 'duration': 250 };
    }

    this.isDefaultStyle = !goog.isDef(options.customStyle);

    this.container = document.createElement('div');
    this.container.className = customStyle;

    /** @type {HTMLElement} DOM索引，内容加到那个DOM NODE上 */
    this.appendContent = null;

    /**
     * 定义默认样式中的样式内容
     */
    if (this.isDefaultStyle) {
        var closer = document.createElement('span');
        closer.className = 'ez-popup-closer';
        this.container.appendChild(closer);
        var that = this;
        closer.addEventListener("click", function(evt) {
            evt.stopPropagation();
            that.close();
            this.blur();
        });

        var content = document.createElement('div');
        content.className = 'ez-popup-content';
        this.container.appendChild(content);
        this.appendContent = content;
    } else {
        this.appendContent = this.container;
    }

    var stopEvent = options.stopEvent ? options.stopEvent : false;

    //创建事件委托用于处理点击事件
    var fn = this.fn_ = options.fn ? options.fn : null;
    if (fn) {
        this.appendContent.addEventListener('click', this.delegate_.bind(this));
    }

    goog.base(this, {
        element: this.container,
        autoPan: false,
        stopEvent: stopEvent,
        insertFirst: (options.hasOwnProperty('insertFirst')) ? options.insertFirst : true,
        positioning: 'bottom-center',
        offset: [offsetX, offsetY]
    });
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
 * 委托函数执行
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
Ez.Popup.prototype.delegate_ = function(evt) {
    if (!this.fn_) return;
    this.fn_(evt);
    return false;
};

/**
 * 关闭POPUP
 */
Ez.Popup.prototype.close = function() {
    this.map_.dispatchEvent(new Ez.PopupTargetMoveEvent('popup:close'));
    this.dispatchEvent(new Ez.PopupEvent('CLOSE'));
    this.map_.removeOverlay(this);
    if (this.map_ && this.map_.popup_) {
        this.map_.popup_ = null;
    }
};

/**
 * Show the popup.
 * @param {Ez.Coordinate} coord Where to anchor the popup.
 * @param {String} html String of HTML to display within the popup.
 */
Ez.Popup.prototype.show = function(html, coord) {
    this.appendContent.innerHTML = html;

    if (coord instanceof Ez.Coordinate) {
        this.setPosition(coord.getCoordinate());
    } else {
        this.setPosition(coord);
    }

    this.container.style.display = 'block';
    this.getMap().dispatchEvent(new Ez.PopupTargetMoveEvent('popup:open'));

    this.updatePixelPosition();

    if (this.panMapIfOutOfView) {
        if (this.map_.frameState_) {
            this.panIntoView_(coord);
        }
    }

    //this.content.scrollTop = 0;
    return this;
};

/**
 * 更新popup内容
 * @param {string} str
 */
Ez.Popup.prototype.setContent = function(str) {
    this.appendContent.innerHTML = str;
};

Ez.Popup.prototype.panIntoView_ = function() {
    var map = this.getMap();

    if (map === undefined || !map.getTargetElement()) {
        return;
    }

    var mapRect = this.getRect_(map.getTargetElement(), map.getSize());
    var element = this.getElement();
    goog.asserts.assert(element, 'element should be defined');
    var overlayRect = this.getRect_(element, [ol.dom.outerWidth(element), ol.dom.outerHeight(element)]);

    var margin = this.autoPanMargin_;
    if (!ol.extent.containsExtent(mapRect, overlayRect)) {
        // the overlay is not completely inside the viewport, so pan the map
        var offsetLeft = overlayRect[0] - mapRect[0];
        var offsetRight = mapRect[2] - overlayRect[2];
        var offsetTop = overlayRect[1] - mapRect[1];
        var offsetBottom = mapRect[3] - overlayRect[3];

        var delta = [0, 0];
        if (offsetLeft < 0) {
            // move map to the left
            delta[0] = offsetLeft - margin;
        } else if (offsetRight < 0) {
            // move map to the right
            delta[0] = Math.abs(offsetRight) + margin;
        }
        if (offsetTop < 0) {
            // move map up
            delta[1] = offsetTop - margin;
        } else if (offsetBottom < 0) {
            // move map down
            delta[1] = Math.abs(offsetBottom) + margin;
        }

        if (delta[0] !== 0 || delta[1] !== 0) {
            var center = map.getView().getCenter();
            goog.asserts.assert(center !== undefined, 'center should be defined');
            var centerPx = map.getPixelFromCoordinate(center);
            var newCenterPx = [
                centerPx[0] + delta[0],
                centerPx[1] + delta[1]
            ];

            if (this.autoPanAnimation_) {
                this.autoPanAnimation_.source = center;
                map.beforeRender(ol.animation.pan(this.autoPanAnimation_));
            }
            map.getView().setCenter(map.getCoordinateFromPixel(newCenterPx));
        }
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
