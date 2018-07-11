/*
|------------------------------------------------------------------------------
|                                ol.MapPane                
|
|@author: qianleyi
|@date: 2016-12-5
|@descript: 地图图层面板用于第三方应用图层扩展
|------------------------------------------------------------------------------
*/
goog.provide('ol.MapPane');

goog.require('ol.Object');
goog.require('goog.dom');

ol.MapPane = function() {
    goog.base(this);

    /**
     * @type {Element}
     * @protected
     */
    this.element = null;

    /**
     * @type {ol.Map}
     * @private
     */
    this.map_ = null;

    /**
     * @protected
     * @type {!Array.<?number>}
     */
    this.listenerKeys = [];

    /**
     * @type {function(ol.MapEvent)}
     */
    this.render = goog.nullFunction;
};
goog.inherits(ol.MapPane, ol.Object);

/**
 * @inheritDoc
 */
ol.MapPane.prototype.disposeInternal = function() {
    goog.dom.removeNode(this.extern);
    goog.base(this, 'disposeInternal');
};

/**
 * 获取map对象
 * @return {ol.Map} Map.
 * @api stable
 */
ol.MapPane.prototype.getMap = function() {
    return this.map_;
};

/**
 * 设置新的地图对象
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.MapPane.prototype.setMap = function(map) {
    if (!goog.isNull(this.map_)) {
        goog.dom.removeNode(this.element);
    }
    if (!goog.array.isEmpty(this.listenerKeys)) {
        goog.array.forEach(this.listenerKeys, goog.events.unlistenByKey);
        this.listenerKeys.length = 0;
    }
    this.map_ = map;
    if (!goog.isNull(this.map_)) {
        var view_port = map.getViewport();
        this.extern = goog.dom.createDom(goog.dom.TagName.DIV,
            'ol-overlaycontainer');
        var len = goog.dom.getChildren(view_port).length;
        goog.dom.insertChildAt(view_port, this.extern, len - 1);
        var target = this.extern;
        goog.dom.appendChild(target, this.element);
        if (this.render !== goog.nullFunction) {
            this.listenerKeys.push(goog.events.listen(map, ol.MapEventType.POSTRENDER, this.render, false, this));
        }
        map.render();
    }
};

ol.MapPane.prototype.setElement = function(element) {
    this.element = element;
};
