/*
|------------------------------------------------------------------------------
|                               Ez.controls.Layers              
|
|@author: qianleyi
|@date: 2015.12.1
|@descript: 默认图层切换控件，实现不同地图服务商的地图切换功能
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.Layers');

/**
 * 图层切换控件
 * @param {Array<Ez.TileLayer>} baseLayers 基础图层组
 * @contructor
 * @extends {ol.controls.Control}
 */
Ez.controls.Layers = function (baseLayers) {
    this.baseLayers_ = {};

    this.eleContainer = document.createElement('div');
    this.showContainer = document.createElement('div');

    this.eleContainer.className = 'ez-layers ol-unselectable ol-control';
    this.showContainer.className = 'ez-layers-showLayers';
    /** 从数组中剥离图层对象 */
    this.layers_ = {};
    for (var i = 0; i < baseLayers.length; i++) {
        var layerInfo = baseLayers[i];
        var subElement = Ez.controls.Layers.generateLayerFrame(layerInfo);
        this.baseLayers_[layerInfo.title] = subElement;
        this.baseLayers_[layerInfo.title + '_layer'] = layerInfo.layer;
        this.layers_[layerInfo.title] = layerInfo.layer;
    }

    /** 事件处理 */
    this.eleContainer.addEventListener('mouseover', goog.bind(this.onMouseOver_, this), false);
    this.eleContainer.addEventListener('mouseout', goog.bind(this.onMouseOut_, this), false);
    this.eleContainer.addEventListener('click', goog.bind(this.onClick_, this), false);

    ol.control.Control.call(this, {
        element: this.eleContainer
    });
};
goog.inherits(Ez.controls.Layers, ol.control.Control);

/**
 * 根据图层信息对象生成相关的DOM元素
 * @param  {Object} layerInfo [description]
 * @return {element}           [description]
 */
Ez.controls.Layers.generateLayerFrame = function (layerInfo) {
    goog.asserts.assert(goog.isDef(layerInfo.title), '图层缺少title信息');
    goog.asserts.assert(goog.isDef(layerInfo.layer), '图层缺少layer对象');
    goog.asserts.assert(goog.isDef(layerInfo.imageSRC), '图层缺少image图标');

    /** @type {element} 图层对象DOM容器 */
    var element = document.createElement('div');
    element.className = 'ez-layers-div ez-layers-hidden';
    element.id = 'ezLayer';
    element.addEventListener('mouseover', function (evt) {
        this.children[1].style.backgroundColor = '#989CFC';
    }, false);
    element.addEventListener('mouseout', function (evt) {
        this.children[1].style.backgroundColor = '';
    }, false);

    var img = document.createElement('img');
    img.src = layerInfo.imageSRC;

    var title = document.createElement('div');
    title.innerHTML = layerInfo.title;
    title.className = 'ez-layers-title';

    element.appendChild(img);
    element.appendChild(title);

    return element;
};

/**
 * 刷新显示
 * @return {[type]} [description]
 */
Ez.controls.Layers.prototype.refesh = function () {
    var map = this.getMap();
    var collection = map.getTileLayers().getLayers();
    var layerReg = /_layer/;

    var topLayer = collection.item(collection.getLength() - 1);
    for (var layerUnit in this.baseLayers_) {
        if (layerUnit === topLayer.get('ezname')) {
            this.eleContainer.appendChild(this.baseLayers_[layerUnit]);
            this.topElement_ = this.baseLayers_[layerUnit];
            this.removeCss(this.topElement_, 'ez-layers-hidden');
            continue;
        }
        if (layerReg.test(layerUnit)) {
            continue;
        }

        this.showContainer.appendChild(this.baseLayers_[layerUnit]);
    }
    this.eleContainer.appendChild(this.showContainer);
};

/**
 * 鼠标移动到控件上时的动作行为
 * @param  {MouseEvent} evt [description]
 * @return {[type]}     [description]
 */
Ez.controls.Layers.prototype.onMouseOver_ = function (evt) {
    evt.stopPropagation();
    this.expand();
};

/**
 * 鼠标离开控件时的动作行为
 * @param  {MouseEvent} evt [description]
 * @return {[type]}     [description]
 */
Ez.controls.Layers.prototype.onMouseOut_ = function (evt) {
    evt.stopPropagation();
    this.collapse();
};

/**
 * 鼠标在扩展div中点击时的控件行为
 * @param  {MouseEvent} evt [description]
 * @return {[type]}     [description]
 */
Ez.controls.Layers.prototype.onClick_ = function (evt) {
    evt.stopPropagation();
    var currentElement = evt.target;
    var nameOfLayer;
    if (currentElement.lastChild) {
        nameOfLayer = currentElement.lastChild.textContent;
    } else {
        nameOfLayer = currentElement.nextSibling.lastChild.textContent;
    }

    this.swapTo(nameOfLayer);
    this.eleContainer.removeChild(this.showContainer);
    while (this.showContainer.hasChildNodes()) {
        this.showContainer.removeChild(this.showContainer.lastChild);
    }
    this.refesh();
};

/**
 * 扩展出其他图层选项
 * @return {[type]} [description]
 */
Ez.controls.Layers.prototype.expand = function () {
    var showElements = this.showContainer.childNodes;
    for (var i = 0; i < showElements.length; i++) {
        this.removeCss(showElements[i], 'ez-layers-hidden');
    }
};

/**
 * 隐藏其他图层选项
 * @return {[type]} [description]
 */
Ez.controls.Layers.prototype.collapse = function () {
    var showElements = this.showContainer.childNodes;
    for (var i = 0; i < showElements.length; i++) {
        this.addCss(showElements[i], 'ez-layers-hidden');
    }
};

/**
 * 移除css类名
 * @return {[type]} [description]
 */
Ez.controls.Layers.prototype.removeCss = function (element, var_args) {
    var classes = this.getClass(element);
    var args = goog.array.slice(arguments, 1);

    var rv = 0;
    for (var i = 0; i < classes.length; i++) {
        if (goog.array.contains(args, classes[i])) {
            goog.array.splice(classes, i--, 1);
            rv++;
        }
    }
    element.className = classes.join(' ');

    return rv == args.length;
};

/**
 * 增加样式
 */
Ez.controls.Layers.prototype.addCss = function (element, var_args) {
    var classes = this.getClass(element);
    var args = goog.array.slice(arguments, 1);

    var rv = 1;

    for (var i = 0; i < args.length; i++) {
        if (!goog.array.contains(classes, args[i])) {
            classes.push(args[i]);
            rv &= 1;
        } else {
            rv &= 0;
        }
    }

    element.className = classes.join(' ');
    return Boolean(rv);
};

/**
 * 获取类名
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
Ez.controls.Layers.prototype.getClass = function (element) {
    var className = element.className;
    // Some types of elements don't have a className in IE (e.g. iframes).
    // Furthermore, in Firefox, className is not a string when the element is
    // an SVG element.
    return className && typeof className.split == 'function' ? className.split(' ') : [];
};

/**
 * 根据name进行切换
 * 
 * @param  {string} name 图层名
 */
Ez.controls.Layers.prototype.swapTo = function (name) {
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
Ez.controls.Layers.prototype.getCurrentTileLayer = function () {
    var tileLayers = this.map_.tileLayerGroup_.getLayers();
    return tileLayers.item(tileLayers.getLength() - 1);
};
