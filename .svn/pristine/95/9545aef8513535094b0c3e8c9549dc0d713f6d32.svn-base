/*
|------------------------------------------------------------------------------
|								Ez.controls.NavBar				
|
|@author: qianleyi
|@date: 2015-12-14
|@descript: 地图导航控件，控制地图上下左右移动
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.NavBar');

goog.require('ol.control.Control');

/**
 * [NavBar description]
 * @param {[type]} navbar_options [description]
 * @contructor
 * @extends {ol.control.Control}
 */
Ez.controls.NavBar = function(navbar_options) {

    var elementContainer = document.createElement('div');
    elementContainer.className = 'ez-navigation ol-unselectable ol-control';

    var topElement = document.createElement('div');
    topElement.className = 'ez-navigation-top ez-navigation-pan';
    topElement.setAttribute('data-orientation', 'NORTH');
    elementContainer.appendChild(topElement);
    var leftElement = document.createElement('div');
    leftElement.className = 'ez-navigation-left ez-navigation-pan';
    leftElement.setAttribute('data-orientation', 'WEST');
    elementContainer.appendChild(leftElement);
    var bottomElement = document.createElement('div');
    bottomElement.className = 'ez-navigation-bottom ez-navigation-pan';
    bottomElement.setAttribute('data-orientation', 'SOUTH');
    elementContainer.appendChild(bottomElement);
    var rightElement = document.createElement('div');
    rightElement.className = 'ez-navigation-right ez-navigation-pan';
    rightElement.setAttribute('data-orientation', 'EAST');
    elementContainer.appendChild(rightElement);

    /** 定义每块div按钮事件 */
    ol.events.listen(topElement, ol.events.EventType.CLICK,
        this.handleClick_, this);
    ol.events.listen(leftElement, ol.events.EventType.CLICK,
        this.handleClick_, this);
    ol.events.listen(bottomElement, ol.events.EventType.CLICK,
        this.handleClick_, this);
    ol.events.listen(rightElement, ol.events.EventType.CLICK,
        this.handleClick_, this);

    ol.control.Control.call(this, {
        element: elementContainer
    });
};
goog.inherits(Ez.controls.NavBar, ol.control.Control);

/**
 * [handleClick_ description]
 * @param  {ol.events.Event} browerEvent [description]
 * @return {[type]}             [description]
 */
Ez.controls.NavBar.prototype.handleClick_ = function(browerEvent) {
    var target = browerEvent.target;
    var orientation = target.getAttribute('data-orientation');

    var map = this.getMap();
    var view = map.getView();

    var viewState = view.getState();
    var mapUnitsDelta = viewState.resolution * 128;
    var deltaX = 0,
        deltaY = 0;
    if (orientation === 'SOUTH') {
        deltaY = -mapUnitsDelta;
    } else if (orientation === 'WEST') {
        deltaX = -mapUnitsDelta;
    } else if (orientation === 'EAST') {
        deltaX = mapUnitsDelta;
    } else {
        deltaY = mapUnitsDelta;
    }

    var delta = [deltaX, deltaY];
    ol.coordinate.rotate(delta, viewState.rotation);
    ol.interaction.Interaction.pan(map, view, delta, 100);
    browerEvent.preventDefault();
};
