/*
|------------------------------------------------------------------------------
|								Ez.controls.ZoomSlider				
|
|@author: qianleyi
|@date: 2015-12-9
|@descript: 默认标准地图级别控制条
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.ZoomSlider');

goog.require('ol.control.Control');

/**
 * 默认标准地图级别控制条
 * @param {Object} opts
 * @construtor
 * @extends {ol.control.Control}
 */
Ez.controls.ZoomSlider = function(opts) {
    var options = goog.isDef(opts) ? opts : {};
    /** 默认的地图级别控制条最大值 */
    var maxZoom = goog.isDef(options.maxZoom) ? options.maxZoom : 18;
    /** 默认的地图级别控制条最小值 */
    var minZoom = goog.isDef(options.minZoom) ? options.minZoom : 2;
    /** 是否显示"街道、县、市、省、国"锚点 */
    var isTitleArea = goog.isDef(options.isTitleArea) ? options.isTitleArea : false;

    /** @type {Element} 定义控件父亲容器 */
    this.eleContainer = document.createElement('div');
    this.eleContainer.className = 'ez-zoomslider ol-unselectable ol-control';

    /** 子容器 */
    var zoomin = document.createElement('div');
    zoomin.className = 'ez-zoomslider-zoomin ez-zoomslider-btn';
    zoomin.title = '放大一级';

    var zoomcontent = document.createElement('div');
    zoomcontent.className = 'ez-zoomslider-zoomcontent';
    zoomcontent.title = '放置到此级别';

    var zoomout = document.createElement('div');
    zoomout.className = 'ez-zoomslider-zoomout ez-zoomslider-btn';
    zoomout.title = '缩小一级';

    /** 判断是否加载右侧浮动区域 */
    this.tagContainer = null;
    if (isTitleArea) {
        this.tagContainer = this.initFlagArea(options.flag2level, maxZoom, minZoom);
        zoomcontent.appendChild(this.tagContainer);
    }

    /** 通过地图级别差定义地图级别控制条的高度 */
    var heightOfControl = (maxZoom - minZoom - 1) * 10 + 15 + 14;
    zoomcontent.style.height = heightOfControl + 'px';

    if (isTitleArea) {
        this.tagContainer.style.height = heightOfControl + 'px';
        /** 定义浮动框事件 */
        zoomcontent.addEventListener('mouseover',
            this.handleTagContainerMouseover_.bind(this), false);
        zoomcontent.addEventListener('mouseout',
            this.handleTagContainerMouseout_.bind(this), false);
        /** 定义每个子节点的CLICK事件 */
        var nodeList = this.tagContainer.children;
        for (var i = 0; i < nodeList.length; i++) {
            nodeList[i].addEventListener('click', this.locationZoom_.bind(this), false);
        }
    }

    var zoomcontenttop = document.createElement('div');
    zoomcontenttop.className = 'ez-zoomslider-zoomcontent-top';
    zoomcontent.appendChild(zoomcontenttop);
    var zoomcontentbottom = document.createElement('div');
    zoomcontentbottom.className = 'ez-zoomslider-zoomcontent-bottom';
    zoomcontent.appendChild(zoomcontentbottom);
    var zoomcontentbody = document.createElement('div');
    zoomcontentbody.className = 'ez-zoomslider-zoomcontent-body';
    zoomcontent.appendChild(zoomcontentbody);
    zoomcontentbody.style.height = (maxZoom - minZoom - 1) * 10 + 'px';

    /** 控制条进度条部分 */
    var zoomcontentrender = this.zoomcontentrender_ = document.createElement('div');
    zoomcontentrender.className = 'ez-zoomslider-zoomcontentrender';
    zoomcontent.appendChild(zoomcontentrender);

    /** 滑块对象 */
    this.thumbElement = document.createElement('div');
    this.thumbElement.className = 'ez-zoomslider-thumb';
    this.thumbElement.title = '拖拽';
    zoomcontent.appendChild(this.thumbElement);

    this.eleContainer.appendChild(zoomin);
    this.eleContainer.appendChild(zoomcontent);
    this.eleContainer.appendChild(zoomout);

    /**
     * @type {goog.fx.Dragger}
     * @private
     */
    this.dragger_ = new ol.pointer.PointerEventHandler(zoomcontent);
    this.registerDisposable(this.dragger_);

    /**
     * @descript
     * 滑块的拖拽范围计算规则：计算起点根据滑块的top计算，移动矩形框范围的高应
     * 该上下各自减去9px（空白区域），其次还应该减去滑块拖拽到最下面时的4.5px（
     * 自身高度的一半）
     */
    //this.dragger_.setLimits(new goog.math.Rect(2, 9 - 4, 0, heightOfControl - 18 - 4));
    //

    //dragger的替代方案，定义自己的边界属性
    this.dragger_.limits = {
        left: 2,
        top: 9 - 4,
        width: 0,
        height: heightOfControl - 18 - 4
    }

    /** 事件定义部分 */
    ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERDOWN,
        this.handleDraggerStart_, this);
    ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERMOVE, this.handleDraggerDrag_, this);
    ol.events.listen(this.dragger_, ol.pointer.EventType.POINTERUP,
        this.handleDraggerEnd_, this);

    ol.events.listen(zoomcontentbody, ol.events.EventType.CLICK,
        this.handleContainerClick_, this);
    ol.events.listen(zoomcontentrender, ol.events.EventType.CLICK,
        this.handleContainerrenderClick_, this);
    ol.events.listen(zoomcontenttop, ol.events.EventType.CLICK,
        this.handleTopClick_, this);
    ol.events.listen(zoomcontentbottom, ol.events.EventType.CLICK,
        this.handleBottomClick_, this);
    ol.events.listen(this.thumbElement, ol.events.EventType.CLICK,
        ol.events.Event.stopPropagation);

    ol.events.listen(zoomin, 'click', this.zoomin_, this);
    ol.events.listen(zoomout, 'click', this.zoomout_, this);

    /**
     * @type {Boolean} 判断要素是否在拖动
     * @private
     */
    this.dragging_;

    /**
     * @type {Boolean} dragStart添加的事件监听集
     * @private
     */
    this.dragListenerKeys_;

    /**
     * 将用来处理视图当前的分辨率
     *
     * @type {number|undefined}
     * @private
     */
    this.currentResolution_ = undefined;

    ol.control.Control.call(this, {
        element: this.eleContainer,
        render: Ez.controls.ZoomSlider.render
    });
};
goog.inherits(Ez.controls.ZoomSlider, ol.control.Control);

/**
 * Update the zoomslider element.
 * @param {ol.MapEvent} mapEvent Map event.
 * @this {ol.control.ZoomSlider}
 * @api
 */
Ez.controls.ZoomSlider.render = function(mapEvent) {
    if (goog.isNull(mapEvent.frameState)) {
        return;
    }
    goog.asserts.assert(goog.isDefAndNotNull(mapEvent.frameState.viewState),
        'viewState should be defined');
    var res = mapEvent.frameState.viewState.resolution;
    if (res !== this.currentResolution_) {
        this.currentResolution_ = res;
        this.setThumbPosition_(res);
        var top = this.thumbElement.style.top;
        var val = this.dragger_.limits.height - parseInt(top) + 4;
        if (val < 0) { val = 0; }
        this.zoomcontentrender_.style.height = val + 'px';
    }
};

/**
 * 根据配置的行政区划与地图级别初始化元素
 * @param  {Object} flag2level [description]
 * @param  {number} maxZoom    [description]
 * @param  {number} minZoom    [description]
 * @return {Element}            [description]
 */
Ez.controls.ZoomSlider.prototype.initFlagArea = function(flag2level, maxZoom, minZoom) {
    var opts = goog.isDef(flag2level) ? flag2level : {};
    var country = goog.isDef(opts.country) ? opts.country : 2;
    var province = goog.isDef(opts.province) ? opts.province : 7;
    var city = goog.isDef(opts.city) ? opts.city : 11;
    var street = goog.isDef(opts.street) ? opts.street : 17;

    var elementArr = [country, province, city, street];
    var elementContainer = document.createElement('div');
    elementContainer.className = 'ez-zoomslider-tagArea ez-zoomslider-tagArea-hidden';
    for (var i = 0; i < elementArr.length; i++) {
        if (elementArr[i] <= maxZoom && elementArr[i] >= minZoom) {
            if (i === 0) {
                var ele1 = document.createElement('div');
                ele1.className = 'ez-zoomslider-tag ez-zoomslider-tag-country';
                ele1.id = 'country';
                ele1.setAttribute('data-zoom', elementArr[i]);
                ele1.style.top = ((maxZoom - elementArr[i] - 1) * 10 + 15 + 5 - 10) + 'px';
                elementContainer.appendChild(ele1);
            } else if (i === 1) {
                var ele2 = document.createElement('div');
                ele2.className = 'ez-zoomslider-tag ez-zoomslider-tag-province';
                ele2.style.top = ((maxZoom - elementArr[i] - 1) * 10 + 15 + 5 - 10) + 'px';
                ele2.id = 'province';
                ele2.setAttribute('data-zoom', elementArr[i]);
                elementContainer.appendChild(ele2);
            } else if (i === 2) {
                var ele3 = document.createElement('div');
                ele3.className = 'ez-zoomslider-tag ez-zoomslider-tag-city';
                ele3.style.top = ((maxZoom - elementArr[i] - 1) * 10 + 15 + 5 - 10) + 'px';
                ele3.id = 'city';
                ele3.setAttribute('data-zoom', elementArr[i]);
                elementContainer.appendChild(ele3);
            } else if (i === 3) {
                var ele4 = document.createElement('div');
                ele4.className = 'ez-zoomslider-tag ez-zoomslider-tag-street';
                ele4.style.top = ((maxZoom - elementArr[i] - 1) * 10 + 15 + 5 - 10) + 'px';
                ele4.id = 'street';
                ele4.setAttribute('data-zoom', elementArr[i]);
                elementContainer.appendChild(ele4);
            }
        }
    }
    return elementContainer;
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleTagContainerMouseover_ = function(browserEvent) {
    this.tagContainer.className = 'ez-zoomslider-tagArea';
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleTagContainerMouseout_ = function(browserEvent) {
    this.tagContainer.className = 'ez-zoomslider-tagArea ez-zoomslider-tagArea-hidden';
};


/**
 * Positions the thumb inside its container according to the given resolution.
 *
 * @param {number} res The res.
 * @private
 */
Ez.controls.ZoomSlider.prototype.setThumbPosition_ = function(res) {
    var position = this.getPositionForResolution_(res);
    var dragger = this.dragger_;
    var thumb = this.thumbElement;

    var top = dragger.limits.top + dragger.limits.height * position;
    goog.style.setPosition(thumb, dragger.limits.left, top);
};

/**
 * Handle dragger start events.
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleDraggerStart_ = function(event) {
    if (!this.dragging_ && event.originalEvent.target === this.thumbElement) {
        this.getMap().getView().setHint(ol.ViewHint.INTERACTING, 1);
        this.previousX_ = event.clientX;
        this.previousY_ = event.clientY;
        this.dragging_ = true;

        if (!this.dragListenerKeys_) {
            var drag = this.handleDraggerDrag_;
            var end = this.handleDraggerEnd_;

            this.dragListenerKeys_ = [
                ol.events.listen(document, ol.events.EventType.MOUSEMOVE, drag, this),
                ol.events.listen(document, ol.events.EventType.MOUSEUP, end, this),
            ];
        }
    }
};

/**
 * Handle dragger drag events.
 *
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleDraggerDrag_ = function(event) {
    // var top = this.thumbElement.style.top;
    // var val = this.dragger_.limits.height - parseInt(top) + 4;
    // this.zoomcontentrender_.style.height = val + 'px';
    // var left = this.thumbElement.style.left;
    // var top = this.thumbElement.style.top;

    // var relativePosition = this.getRelativePosition_(parseInt(left), event.clientY - parseInt(top));
    // this.currentResolution_ = this.getResolutionForPosition_(relativePosition);
    // this.getMap().getView().setResolution(this.currentResolution_);

    if (this.dragging_) {
        var element = this.thumbElement;
        var deltaX = event.clientX - this.previousX_ + parseInt(element.style.left, 10);
        var deltaY = event.clientY - this.previousY_ + parseInt(element.style.top, 10);
        //计算阴影部分的DOM高度
        var val = parseInt(this.dragger_.limits.height) - parseInt(element.style.top) + 4;
        this.zoomcontentrender_.style.height = val + 'px';
        var relativePosition = this.getRelativePosition_(deltaX, deltaY);
        this.currentResolution_ = this.getResolutionForPosition_(relativePosition);
        this.getMap().getView().setResolution(this.currentResolution_);
        this.setThumbPosition_(this.currentResolution_);
        this.previousX_ = event.clientX;
        this.previousY_ = event.clientY;
    }
};

/**
 * Handle dragger end events.
 * @param {goog.fx.DragEvent} event The drag event.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleDraggerEnd_ = function(event) {
    // var map = this.getMap();
    // var view = map.getView();
    // view.setHint(ol.ViewHint.INTERACTING, -1);
    // goog.asserts.assert(goog.isDef(this.currentResolution_),
    //     'this.currentResolution_ should be defined');
    // var resolution = view.constrainResolution(this.currentResolution_);
    // view.setResolution(resolution);

    // var thumb = this.thumbElement;
    // thumb.title = view.getZoom();

    if (this.dragging_) {
        var map = this.getMap();
        var view = map.getView();
        view.setHint(ol.ViewHint.INTERACTING, -1);
        goog.asserts.assert(this.currentResolution_,
            'this.currentResolution_ should be defined');
        // map.beforeRender(ol.animation.zoom({
        //     resolution: this.currentResolution_,
        //     duration: this.duration_,
        //     easing: ol.easing.easeOut
        // }));

        var resolution = view.constrainResolution(this.currentResolution_);
        view.setResolution(resolution);
        this.dragging_ = false;
        this.previousX_ = undefined;
        this.previousY_ = undefined;
        this.dragListenerKeys_.forEach(ol.events.unlistenByKey);
        this.dragListenerKeys_ = null;
    }
};

/**
 * 根据要素的data-zoom属性定位zoom到指定的地图级别
 * @param  {[type]} browserEvent [description]
 * @return {[type]}              [description]
 */
Ez.controls.ZoomSlider.prototype.locationZoom_ = function(browserEvent) {
    var map = this.getMap();
    var view = map.getView();
    var zoomValue = parseInt(browserEvent.target.getAttribute('data-zoom'));
    view.setZoom(zoomValue);
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleContainerClick_ = function(browserEvent) {
    var map = this.getMap();
    var view = map.getView();
    var currentResolution = view.getResolution();
    goog.asserts.assert(goog.isDef(currentResolution),
        'currentResolution should be defined');
    var relativePosition = this.getRelativePosition_(
        browserEvent.offsetX - 18 / 2,
        browserEvent.offsetY - 9 / 2 + 11);
    var resolution = this.getResolutionForPosition_(relativePosition);
    view.setResolution(view.constrainResolution(resolution));

    var thumb = this.thumbElement;
    thumb.title = view.getZoom();
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleContainerrenderClick_ = function(browserEvent) {
    var map = this.getMap();
    var view = map.getView();
    var thumb = this.thumbElement;
    var currentResolution = view.getResolution();
    goog.asserts.assert(goog.isDef(currentResolution),
        'currentResolution should be defined');
    var relativePosition = this.getRelativePosition_(
        browserEvent.offsetX - 18 / 2,
        browserEvent.offsetY + parseFloat(thumb.style.top));
    var resolution = this.getResolutionForPosition_(relativePosition);
    view.setResolution(view.constrainResolution(resolution));


    thumb.title = view.getZoom();
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleTopClick_ = function(browserEvent) {
    var map = this.getMap();
    var view = map.getView();
    var currentResolution = view.getResolution();
    goog.asserts.assert(goog.isDef(currentResolution),
        'currentResolution should be defined');
    var relativePosition = this.getRelativePosition_(0, 5);
    var resolution = this.getResolutionForPosition_(relativePosition);
    view.setResolution(view.constrainResolution(resolution));

    var thumb = this.thumbElement;
    thumb.title = view.getZoom();
};

/**
 * @param {ol.events.BrowserEvent} browserEvent The browser event to handle.
 * @private
 */
Ez.controls.ZoomSlider.prototype.handleBottomClick_ = function(browserEvent) {
    var map = this.getMap();
    var view = map.getView();
    var currentResolution = view.getResolution();
    goog.asserts.assert(goog.isDef(currentResolution),
        'currentResolution should be defined');
    var relativePosition = this.getRelativePosition_(0, 151);
    var resolution = this.getResolutionForPosition_(relativePosition);
    view.setResolution(view.constrainResolution(resolution));

    var thumb = this.thumbElement;
    thumb.title = view.getZoom();
};

/**
 * 地图放大一级
 * @return {[type]} [description]
 */
Ez.controls.ZoomSlider.prototype.zoomin_ = function() {
    var map = this.getMap();
    var view = map.getView();
    var current = view.getZoom();
    view.setZoom(current + 1);
};

/**
 * 地图缩小一级
 * @return {[type]} [description]
 */
Ez.controls.ZoomSlider.prototype.zoomout_ = function() {
    var map = this.getMap();
    var view = map.getView();
    var current = view.getZoom();
    view.setZoom(current - 1);
};

/**
 * Calculates the relative position of the thumb given x and y offsets.  The
 * relative position scales from 0 to 1.  The x and y offsets are assumed to be
 * in pixel units within the dragger limits.
 *
 * @param {number} x Pixel position relative to the left of the slider.
 * @param {number} y Pixel position relative to the top of the slider.
 * @return {number} The relative position of the thumb.
 * @private
 */
Ez.controls.ZoomSlider.prototype.getRelativePosition_ = function(x, y) {
    var draggerLimits = this.dragger_.limits;
    var amount;
    if (this.direction_ === ol.control.ZoomSlider.direction.HORIZONTAL) {
        amount = (x - draggerLimits.left) / draggerLimits.width;
    } else {
        amount = (y - draggerLimits.top) / draggerLimits.height;
    }
    return goog.math.clamp(amount, 0, 1);
};

/**
 * Calculates the corresponding resolution of the thumb given its relative
 * position (where 0 is the minimum and 1 is the maximum).
 *
 * @param {number} position The relative position of the thumb.
 * @return {number} The corresponding resolution.
 * @private
 */
Ez.controls.ZoomSlider.prototype.getResolutionForPosition_ = function(position) {
    var fn = this.getMap().getView().getResolutionForValueFunction();
    return fn(1 - position);
};

/**
 * Determines the relative position of the slider for the given resolution.  A
 * relative position of 0 corresponds to the minimum view resolution.  A
 * relative position of 1 corresponds to the maximum view resolution.
 *
 * @param {number} res The resolution.
 * @return {number} The relative position value (between 0 and 1).
 * @private
 */
Ez.controls.ZoomSlider.prototype.getPositionForResolution_ = function(res) {
    var fn = this.getMap().getView().getValueForResolutionFunction();
    return 1 - fn(res);
};
