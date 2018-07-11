/*
|------------------------------------------------------------------------------
|                               ol.interaction.DragFeature              
|
|@author: qianleyi
|@date: 2016-05-09
|@descript: 增加新交互，用于拖动点击的要素，释放定位
|------------------------------------------------------------------------------
*/
goog.provide('ol.interaction.DragFeature');

goog.require('ol.interaction.Pointer');

/**
 * 交互类，用于实现点击拖拽要素的交互功能
 * @constructor
 * @extends {ol.interaction.Pointer}
 */
ol.interaction.DragFeature = function() {

    ol.interaction.Pointer.call(this, {
        handleDownEvent: this.handleDownEvent,
        handleDragEvent: this.handleDragEvent,
        handleMoveEvent: this.handleMoveEvent,
        handleUpEvent: this.handleUpEvent
    });

    /**
     * @type {ol.Coordinate}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {ol.Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;
};
goog.inherits(ol.interaction.DragFeature, ol.interaction.Pointer);

/**
 * 处理鼠标按下事件
 * @param  {ol.MapBrowserEvent} evt
 * @return {boolean} 如果为true,开始拖拽流程
 */
ol.interaction.DragFeature.prototype.handleDownEvent = function(evt) {

    var map = evt.map;

    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
    });

    if (feature && feature.get('draggable')) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
        if (this.feature_ instanceof Ez.Marker) {
            this.feature_.dispatchEvent(new Ez.MarkerDragEvent('dragstart'));
        }
        return true;
    } else {
        return false;
    }
};

/**
 * 处理drag事件
 * @param  {ol.MapBrowserEvent} evt
 * @return {[type]}     [description]
 */
ol.interaction.DragFeature.prototype.handleDragEvent = function(evt) {
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = /** @type {ol.geom.SimpleGeometry} */
        (this.feature_.getGeometry());
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
};

/**
 * 处理鼠标移动
 * @param  {ol.MapBrowserEvent} evt
 */
ol.interaction.DragFeature.prototype.handleMoveEvent = function(evt) {
    if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
            return feature;
        });
        var element = evt.map.getTargetElement();
        if (feature) {
            if (element.style.cursor != this.cursor_) {
                this.previousCursor_ = element.style.cursor;
                element.style.cursor = this.cursor_;
            }
        } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
        }
    }
};

/**
 * 处理鼠标弹起事件
 * @return {boolean} 'false'表示结束drag流程
 */
ol.interaction.DragFeature.prototype.handleUpEvent = function() {
    if (this.feature_ instanceof Ez.Marker) {
        this.feature_.dispatchEvent(new Ez.MarkerDragEvent('dragend'));
    }
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
};
