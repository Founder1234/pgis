/*
|------------------------------------------------------------------------------
|               ol.extern.Extern类       
|
|@author: qianleyi
|@date: 2015-12-28
|@descript: overlay类的扩展类用于集成其他第三方组件
|------------------------------------------------------------------------------
*/
goog.provide('ol.extern.Extern');

goog.require('ol.Object');
goog.require('goog.dom');

ol.extern.Extern = function(options) {

    goog.base(this);

    /**
     * @type {Element}
     * @protected
     */
    this.element = goog.isDef(options.element) ? options.element : null;

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
    this.render = goog.isDef(options.render) ? options.render : goog.nullFunction;

    if (goog.isDef(options.target)) {
        this.setTarget(options.target);
    }
};
goog.inherits(ol.extern.Extern, ol.Object);

/**
 * @inheritDoc
 */
ol.extern.Extern.prototype.disposeInternal = function() {
    goog.dom.removeNode(this.element);
    goog.base(this, 'disposeInternal');
};

/**
 * 获取map对象
 * @return {ol.Map} Map.
 * @api stable
 */
ol.extern.Extern.prototype.getMap = function() {
    return this.map_;
};

/**
 * 设置新的地图对象
 * @param {ol.Map} map Map.
 * @api stable
 */
ol.extern.Extern.prototype.setMap = function(map) {
    if (!goog.isNull(this.map_)) {
        goog.dom.removeNode(this.element);
    }
    if (!goog.array.isEmpty(this.listenerKeys)) {
        goog.array.forEach(this.listenerKeys, ol.events.unlistenByKey);
        this.listenerKeys.length = 0;
    }
    this.map_ = map;
    if (!goog.isNull(this.map_)) {
        var view_port = map.getViewport();
        this.ol3_extern = goog.dom.createDom(goog.dom.TagName.DIV,
            'ol-extern-echarts');
        var len = goog.dom.getChildren(view_port).length;
        goog.dom.insertChildAt(view_port, this.ol3_extern, len - 1);
        var target = this.ol3_extern;
        goog.dom.appendChild(target, this.element);
        if (this.render !== goog.nullFunction) {
            this.listenerKeys.push(ol.events.listen(map, ol.MapEventType.POSTRENDER, this.render, false, this));
        }
        map.render();
    }
};
