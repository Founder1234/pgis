/*
|------------------------------------------------------------------------------
|                                Ez.controls.SimpleZoom                
|
|@author: qianleyi
|@date: 2017-01-03
|@descript: 极简化地图缩放控件
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.SimpleZoom');

Ez.controls.SimpleZoom = function() {

    var element = this.createDom('div', 'ez-simple-zoom ol-unselectable ol-control');

    var zoomInElement = this.createDom('div', 'ez-simple-btn');
    zoomInElement.title = "放大一级";
    var zoomin = this.createDom('div', 'ez-simple-zoomview ez-simple-zoomin');
    zoomInElement.appendChild(zoomin);
    var viewElement = this.createDom('div', 'ez-simple-btn');
    viewElement.title = "当前级别";
    var viewstatus = this.view = this.createDom('div', 'ez-simple-zoomview ez-simple-status');
    viewElement.appendChild(viewstatus);
    var zoomOutElement = this.createDom('div', 'ez-simple-btn');
    zoomOutElement.title = "缩小一级";
    var zoomout = this.createDom('div', 'ez-simple-zoomview ez-simple-zoomout');
    zoomOutElement.appendChild(zoomout);

    zoomInElement.addEventListener('click', this.handleZoomIn.bind(this));
    zoomOutElement.addEventListener('click', this.handleZoomOut.bind(this));

    element.appendChild(zoomInElement);
    element.appendChild(viewElement);
    element.appendChild(zoomOutElement);

    window.setTimeout(this.initView.bind(this), 300);

    goog.base(this, {
        element: element
    });
};
goog.inherits(Ez.controls.SimpleZoom, ol.control.Control);

Ez.controls.SimpleZoom.prototype.initView = function() {
    var map = this.getMap();
    var zoom = map.getZoom();
    this.view.innerHTML = zoom;
    map.getView().on('change:resolution', function(evt) {
        this.view.innerHTML = map.getZoom();
    }.bind(this));
};

Ez.controls.SimpleZoom.prototype.createDom = function(tag, classname) {
    var e = document.createElement(tag);
    e.className = classname;
    return e;
};

Ez.controls.SimpleZoom.prototype.handleZoomIn = function() {
    var map = this.getMap();
    map.zoomIn();
};

Ez.controls.SimpleZoom.prototype.handleZoomOut = function() {
    var map = this.getMap();
    map.zoomOut();
};
