//FIXED: 增加点击添加DOM交互
goog.provide('ol.interaction.AddDOMForClick');

goog.require('ol.Overlay');

/**
 * @classdes 当鼠标点击map时，增加一个自定义的DOM元素（ol.Overlayer）到地图上
 *
 * @constructor 
 * @param {olx.options} [opt_options] 配置DOM的参数对象
 * @extends {ol.interaction.Pointer}
 */
ol.interaction.AddDOMForClick = function(opt_options) {
    goog.base(this, {
        handleDownEvent: ol.interaction.AddDOMForClick.handleDownEvent_
    });

    var options = goog.isDef(opt_options) ? opt_options : {};

    var element = document.createElement('div');
    var t = document.createTextNode('test');
    element.appendChild(t);
    element.style.marginLeft = -5;
    element.style.marginTop = -3;

    this.overlay_ = goog.isDef(options.overlay) ? options.overlay : new ol.Overlay({
        element: element
    });
};
goog.inherits(ol.interaction.AddDOMForClick, ol.interaction.Pointer);



/**
 * [handleDownEvent_ description]
 * @param  {ol.MapBrowserPointerEvent} mapBrowserEvent mapBrowserEvent事件
 * @this {ol.interaction.AddDOMForClick}
 */
ol.interaction.AddDOMForClick.handleDownEvent_ = function(mapBrowserEvent) {
    var browserEvent = mapBrowserEvent.browserEvent;

    if (browserEvent.isMouseActionButton()) {
        var coordinate = mapBrowserEvent.coordinate;
        var map = mapBrowserEvent.map;
        this.overlay_.setPosition(coordinate);
        map.addOverlay(this.overlay_);
        return true;
    } else {
        return false;
    }
};
