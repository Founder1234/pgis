/*
|------------------------------------------------------------------------------
|                                Ez.controls.SimpleLayers                
|
|@author: qianleyi
|@date: 2017-01-04
|@descript: 简洁版横向图层切换控件
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.SimpleLayers');

Ez.controls.SimpleLayers = function(baseLayers) {

    var element = this.element = document.createElement('div');
    element.className = 'ez-simple-layers ol-unselectable ol-control';
    element.id = "ez_simple_layers";

    this.layers_ = {};

    for (var i = baseLayers.length - 1; i >= 0; i--) {
        var layercard;
        if (i === 0) {
            layercard = this.createLayerCard(baseLayers[i]);
        } else {
            layercard = this.createLayerCard(baseLayers[i], true);
        }
        element.appendChild(layercard);

        this.layers_[baseLayers[i].title] = baseLayers[i].layer;
    }

    /* 增加父类的mouseover事件 */
    element.addEventListener('mouseover', this.onMouseOver.bind(this));
    /* 增加父类的mouseout事件 */
    element.addEventListener('mouseout', this.onMouseOut.bind(this));

    goog.base(this, {
        element: element
    });
}
goog.inherits(Ez.controls.SimpleLayers, ol.control.Control);

Ez.controls.SimpleLayers.prototype.createLayerCard = function(layerinfo, isHide) {
    var title = layerinfo.title;
    var layer = layerinfo.layer;
    var imgsrc = layerinfo.imageSRC;

    var e = document.createElement('div');
    if (isHide) {
        e.className = 'ez-simple-card hide';
    } else {
        e.className = 'ez-simple-card';
    }
    var img = document.createElement('img');
    img.src = imgsrc;
    var span = document.createElement('span');
    span.innerHTML = title;

    /* 增加鼠标事件要素样式变化部分 */
    e.addEventListener('mouseover', this.oncardmouseover.bind(e, this));
    e.addEventListener('mouseout', this.oncardmouseout.bind(e, this));
    e.addEventListener('click', this.oncardclick.bind(e, this));

    e.appendChild(img);
    e.appendChild(span);

    return e;
};

Ez.controls.SimpleLayers.prototype.onMouseOver = function(evt) {
    var element = this.element;
    var layercards = element.children;

    /* 触发父容器focus样式 */
    this.addClass(element, 'ez-simple-layers--onfocus');
    /* 子节点容器样式变化 */
    for (var i = 0; i < layercards.length - 1; i++) {
        this.removeClass(layercards[i], 'hide');
    }
};

Ez.controls.SimpleLayers.prototype.onMouseOut = function(evt) {
    var element = this.element;
    var layercards = element.children;

    /* 移除父容器focus样式 */
    this.removeClass(element, 'ez-simple-layers--onfocus');
    /* 子节点容器样式变化 */
    for (var i = 0; i < layercards.length - 1; i++) {
        this.addClass(layercards[i], 'hide');
    }
};

Ez.controls.SimpleLayers.prototype.oncardmouseover = function(self) {
    var element = this;
    var span = element.children[1];
    self.addClass(element, 'ez-simple-card--onfocus');
    self.addClass(span, 'ez-simple-card-title--onfocus');
};

Ez.controls.SimpleLayers.prototype.oncardmouseout = function(self) {
    var element = this;
    var span = element.children[1];
    self.removeClass(element, 'ez-simple-card--onfocus');
    self.removeClass(span, 'ez-simple-card-title--onfocus');
};

Ez.controls.SimpleLayers.prototype.oncardclick = function(self) {
    var title = this.children[1].textContent;
    self.swapTo(title);
};

Ez.controls.SimpleLayers.prototype.addClass = function(dom, classname) {
    this.removeClass(dom, classname);
    dom.className += ' ' + classname;
};

Ez.controls.SimpleLayers.prototype.removeClass = function(dom, classname) {
    var styles = dom.className.split(' ');
    for (var i = 0; i < styles.length; i++) {
        if (styles[i] === classname) {
            styles.splice(i, 1);
            break;
        }
    }
    dom.className = styles.join(' ');
};

/**
 * 根据name进行切换
 * 
 * @param  {string} name 图层名
 */
Ez.controls.SimpleLayers.prototype.swapTo = function(name) {
    var map = this.getMap();
    if (!goog.isDef(name)) {
        return;
    }

    //检测目前图层是否是将要切换之图层
    var currentTileLayer = this.getCurrentTileLayer(),
        currentLayerName = currentTileLayer.get('ezname');
    if (name === currentLayerName) {
        return;
    }

    //对图层进行切换
    var layers = this.layers_,
        layer = layers[name];
    //目前视图投影参数以及目标图层数据源投影参数
    //目前视图分辨率参数以及目标图层数据源网格分辨率参数
    var currentViewProjection = map.getView().getProjection();
    var layerProjection, layerSourceReslutions;

    if (layer instanceof Ez.Layer.Group) {
        layerProjection = layer.getLayers().getArray()[0].getSource().getProjection();
        layerSourceReslutions = layer.getLayers().getArray()[0].getResolutions();
    } else if (typeof layer === 'function') {
        var isDeleteBaseMap = true;
        isDeleteBaseMap = layer();
        if (isDeleteBaseMap) map.removeLayer(currentTileLayer);
        return;
    } else {
        layerSourceReslutions = layer.getResolutions();
        layerProjection = layer.getSource().getProjection();
    }
    //目前视图中心坐标以及zoom
    var currentCoordinate = map.getView().getCenter(),
        currentZoom = map.getView().getZoom();

    //目前视图切换到目标参数
    var view = map.getView(),
        viewState = view.getState();

    var dest_coordinate = ol.proj.transform(currentCoordinate, currentViewProjection, layerProjection);
    var view_options = {
        center: dest_coordinate,
        projection: layerProjection,
        resolutions: layerSourceReslutions,
        zoom: currentZoom
    };


    //map.setView(new ol.View(view_options));
    map.removeLayer(currentTileLayer);
    map.addLayer(layer);
};

/**
 * 获得最上层的瓦片图层
 * @return {Ez.TileLayer} 
 */
Ez.controls.SimpleLayers.prototype.getCurrentTileLayer = function() {
    var tileLayers = this.map_.tileLayerGroup_.getLayers();
    return tileLayers.item(tileLayers.getLength() - 1);
};
