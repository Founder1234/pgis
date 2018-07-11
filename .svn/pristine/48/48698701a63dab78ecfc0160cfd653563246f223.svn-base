/*
|------------------------------------------------------------------------------
|                               Ez.Title.js             
|
|@author: qianleyi
|@date: 2016-3-23
|@descript: 标题地图展示类，修改3.14.1基线升级造成的Title不能显示问题
|------------------------------------------------------------------------------
*/
goog.provide('Ez.Title');

goog.require('ol.style.Style');
goog.require('goog.asserts.assert');


Ez.Title = function(name, options) {

    goog.base(this, {
        geometry: new ol.geom.Point([0, 0])
    });

    goog.asserts.assert(goog.isDef(name), "Title对象构造时name参数不能为空");

    /**
     * @private
     * @type {string}
     */
    this.title_ = name;

    var opts = goog.isDef(options) ? options : {};

    /**
     * 默认样式
     * @type {ol.style.Style}
     * @private
     */
    var defaultStyle = this.defaultStyle_ = {
        "font": goog.isDef(opts.font) ? opts.font : "微软雅黑,宋体",
        "fontSize": goog.isDef(opts.fontSize) ? parseInt(opts.fontSize) : 12,
        "fontColor": goog.isDef(opts.fontColor) ? opts.fontColor : "#000000",
        "fillColor": goog.isDef(opts.fillColor) ? opts.fillColor : "#FFFFFF",
        "strokeColor": goog.isDef(opts.strokeColor) ? opts.strokeColor : "#000000",
        "isStroke": goog.isDef(opts.isStroke) ? opts.isStroke : false,
        "strokeWidth": goog.isDef(opts.strokeWidth) ? parseInt(opts.strokeWidth) : 1,
        /**
         * @value {undefined|<dashArray|inherit>} 
         * SVG等的dash样式设置，默认为none
         * 当设置虚线时，通过传入<dashArray>来设置线型
         * 参考https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray
         */
        "strokeStyle": goog.isDef(opts.strokeStyle) ? opts.strokeStyle : undefined,
        "textAlign": goog.isDef(opts.textAlign) ? opts.textAlign : "center",
        "textBaseline": goog.isDef(opts.textBaseline) ? opts.textBaseline : "middle",
        /** Title的BBox到字体的间隔 */
        "paddingV": goog.isDef(opts.paddingV) ? parseInt(opts.paddingV) : 1,
        "lineHeight": goog.isDef(opts.lineHeight) ? parseInt(opts.lineHeight) : 1,
        "paddingH": goog.isDef(opts.paddingH) ? parseInt(opts.paddingH) : 2,
        /** Box的定位位置 */
        "positioning": goog.isDef(opts.positioning) ? opts.positioning : "top-left",
        /** Title偏移量 */
        "anchor": goog.isDef(opts.anchor) ? opts.anchor : [0.5, 1],
        "offset": goog.isDef(opts.offset) ? opts.offset : [0, 0],
        "gap": goog.isDef(opts.gap) ? opts.gap : 2
    };

    /**
     * @private
     * @type {Ez.Map}
     */
    this.map_ = null;

    /**
     * Title对象的位置
     * @type {ol.Coordinate}
     */
    this.position_ = [0, 0];

    /**
     * 定位方式
     * @type {String}
     * @private
     */
    this.positioning_ = defaultStyle.positioning;

    /**
     * 偏移量
     * @type {Array.<number,number>}
     * @private
     */
    this.offset_ = defaultStyle.offset;

    /**
     * 是否显示Title
     * @type {Boolean}
     */
    this.isShow = true;

    this.setStyle(Ez.Title.styleFunction.bind(this));

    /** 添加其他属性 */
    if (opts.draggable) {
        this.set('draggable', opts.draggable);
    }
};
goog.inherits(Ez.Title, ol.Feature);

/**
 * 默认的参数转为OL3的font样式
 * @param  {number} num
 * @param  {string} fontStr
 * @return {string}
 */
Ez.Title.formatFont = function(num, fontStr) {
    return num + 'px' + ' ' + fontStr;
};

/**
 * Text 样式渲染函数 
 * @param  {Ez.Title} feature
 * @param  {Number} resolution
 * @return {ol.style.Style}
 */
Ez.Title.styleFunction = function(feature, resolution) {
    if (!this.isShow) return null;

    var defaultStyle = this.getDefaultStyle_();

    /* 计算字符串的宽度 */
    var textWidth = this.calcWidthOfTitle(this.getTitle());

    /* 计算偏移量 */
    var offsetX = this.offset_[0];
    var offsetY = this.offset_[1];

    /* 计算canvas包络框的宽度和高度 */
    var canvasWidth = textWidth + Number(defaultStyle.paddingH) + Math.abs(offsetX);
    var canvasHeight = Math.ceil(parseFloat(defaultStyle.fontSize) * parseFloat(defaultStyle.lineHeight)) + Math.abs(offsetY);

    /* 构建渲染器 */
    var canvas = document.createElement('canvas');
    var render = ol.render.toContext(canvas.getContext('2d'), {
        size: [canvasWidth, canvasHeight]
    });

    /* 处理Title的背景边框部分 */
    var titleFillStyle = new ol.style.Fill({
        color: defaultStyle.fillColor
    });

    var titleStrokeStyle;
    if (defaultStyle.isStroke) {
        titleStrokeStyle = new ol.style.Stroke({
            color: defaultStyle.strokeColor,
            width: defaultStyle.strokeWidth,
            lineDash: defaultStyle.strokeStyle
        });
    } else {
        titleStrokeStyle = new ol.style.Stroke({
            color: defaultStyle.fillColor,
            width: 1,
            lineDash: undefined
        });
    }

    render.setFillStrokeStyle(titleFillStyle, titleStrokeStyle);
    render.setTextStyle(null);

    //绘制背景矩形
    var borderLeft = (offsetX > 0) ? offsetX : 0;
    var borderTop = (offsetY > 0) ? offsetY : 0;
    var borderWidth = textWidth + Number(defaultStyle.paddingH) + borderLeft;
    var borderHeight = Math.ceil(parseFloat(defaultStyle.fontSize) * parseFloat(defaultStyle.lineHeight));
    render.drawPolygonGeometry(new ol.geom.Polygon(
        [
            [
                [borderLeft, borderTop],
                [borderWidth, borderTop],
                [borderWidth, borderHeight],
                [borderLeft, borderHeight],
                [borderLeft, borderTop]
            ]
        ]
    ));

    //设置Title及其样式
    render.setTextStyle(new ol.style.Text({
        text: this.getTitle().trim(),
        font: Ez.Title.formatFont(defaultStyle.fontSize, defaultStyle.font),
        textAlign: 'center',
        textBaseline: 'middle',
        fill: new ol.style.Fill({
            color: defaultStyle.fontColor
        })
    }));
    //绘制文字
    render.drawPointGeometry(new ol.geom.Point([borderLeft + Math.ceil((textWidth + Number(defaultStyle.paddingH)) / 2), borderTop + Math.ceil(borderHeight / 2)]));

    //定义最终的样式：
    var style = new ol.style.Style({
        image: new ol.style.Icon({
            img: canvas,
            imgSize: [canvas.width, canvas.height],
            anchor: defaultStyle.anchor
        })
    });

    return style;
};

/**
 * 获取默认样式
 * @return {Object}
 */
Ez.Title.prototype.getDefaultStyle_ = function() {
    return this.defaultStyle_;
};

/**
 * 计算一个字符串的字节个数
 * @param  {string} title
 * @return {number}
 */
Ez.Title.prototype.calcWidthOfTitle = function(title) {
    var str = title.trim();
    var defaultStyle = this.getDefaultStyle_();

    var canvasdom = document.createElement('canvas');
    var ctx = canvasdom.getContext("2d");

    ctx.font = Ez.Title.formatFont(defaultStyle.fontSize, defaultStyle.font);
    return ctx.measureText(str).width;
};

/**
 * 获取Title名
 * @return {String}
 */
Ez.Title.prototype.getTitle = function() {
    return this.title_;
};

/**
 * 显示Title
 */
Ez.Title.prototype.show = function() {
    this.isShow = true;
    //this.updatePixelPosition();
};

/**
 * 隐藏Title
 */
Ez.Title.prototype.hide = function() {
    this.isShow = false;
    //this.updatePixelPosition();
};

/**
 * onAdd 方法
 * @param  {Ez.Map} map
 */
Ez.Title.prototype.onAdd = function(map) {
    this.map_ = map;
    //default marker 图层
    var markerLayers = map.getMarkerLayers();
    var markerEle = this;
    markerLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'marker_default') {
            var markerlayer = /** @type {ol.layer.Vector} */ (ele);
            markerlayer.getSource().addFeature(markerEle);
        }
    });
};

/**
 * onRemove 方法
 * @param  {Ez.Map} map
 */
Ez.Title.prototype.onRemove = function(map) {
    this.map_ = null;
    //default marker 图层
    var markerLayers = map.getMarkerLayers();
    var markerEle = this;
    markerLayers.getLayers().forEach(function(ele, index, arr) {
        if (ele.get('name') === 'marker_default') {
            var markerlayer = /** @type {ol.layer.Vector} */ (ele);
            markerlayer.getSource().removeFeature(markerEle);
        }
    });
};

/**
 * 设置坐标
 * @param {Number[]} pos
 */
Ez.Title.prototype.setPosition = function(pos) {
    if (pos instanceof Ez.Coordinate) {
        this.position_ = pos.getCoordinate();
    } else {
        this.position_ = pos;
    }

    this.getGeometry().setCoordinates(this.position_);
};

/**
 * 设置偏移
 * @param {Number[]} arr
 */
Ez.Title.prototype.setOffset = function(arr) {
    this.offset_ = arr;
    this.changed();
};

// 以下为需要保留的类名以及方法
goog.exportSymbol('EzTitle', Ez.Title);
