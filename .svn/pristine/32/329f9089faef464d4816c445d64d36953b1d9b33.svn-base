/*
|------------------------------------------------------------------------------
|               ol.interaction.Draw2        
|
|@author: qianleyi
|@date: 2015-12-23
|@descript: 类似OL3的draw交互控件，解决与EzServerClientV7.0的API接口兼容性问题
|------------------------------------------------------------------------------
*/
goog.provide('ol.interaction.Draw2');

goog.require('ol.interaction.Pointer');

/**
 * @classdesc
 * 绘制地理要素与地图交互
 *
 * @constructor
 * @extends {ol.interaction.Pointer}
 * @fires ol.interaction.DrawEvent
 * @param {olx.interaction.DrawOptions} options Options.
 * @api stable
 */
ol.interaction.Draw2 = function(options) {

    goog.base(this, {
        handleDownEvent: ol.interaction.Draw2.handleDownEvent_,
        handleEvent: ol.interaction.Draw2.handleEvent,
        handleUpEvent: ol.interaction.Draw2.handleUpEvent_
    });

    var opts = goog.isDef(options) ? options : {};

    /**
     * @type {ol.pixel}
     * @private
     */
    this.downPx_ = null;

    /**
     * 用于绘制要素的目标数据源
     * @type {ol.source.Vector}
     * @private
     */
    this.source_ = goog.isDef(opts.source) ? opts.source : null;

    /**
     * 绘制要素的目标数据集合
     * @type {ol.Collection.<ol.Feature>}
     * @private
     */
    this.features_ = goog.isDef(opts.features) ? opts.features : null;

    /**
     * 用于捕捉的像素距离
     * @type {number}
     * @private
     */
    this.snapTolerance_ = goog.isDef(opts.snapTolerance) ? opts.snapTolerance : 12;

    /**
     * 地理要素类型
     * @type {ol.geom.GeometryType}
     * @private
     */
    this.type_ = opts.type;

    /**
     * 绘制的模式
     * @type {ol.interaction.DrawMode}
     * @private
     */
    this.mode_ = ol.interaction.Draw.getMode_(this.type_);

    /**
     * 设置绘制的最少数量点，多义线最少两个点，多边形最少3个点
     * @type {number}
     * @private
     */
    this.minPoints_ = goog.isDef(opts.minPoints) ? opts.minPoints : (this.mode_ === ol.interaction.DrawMode.POLYGON ? 3 : 2);

    /**
     * 设置多边形容许绘制的最大数量点
     * @type {number}
     * @private
     */
    this.maxPoints_ = goog.isDef(opts.maxPoints) ? opts.maxPoints : Infinity;

    /**
     * 帮助提示元素
     * @type {Element}
     */
    this.helpTooltipElement = null;

    /**
     * 帮助提示overlay
     * @type {ol.Overlay}
     */
    this.helpTooltip = null;

    /**
     * 是否显示提示
     * @type {Boolean}
     */
    this.tip_ = goog.isDef(opts.tip) ? opts.tip : true;

    var geometryFunction = opts.geometryFunction;
    if (!goog.isDef(geometryFunction)) {
        if (this.type_ === ol.geom.GeometryType.CIRCLE) {
            /**
             * @param {ol.Coordinate | Array.<ol.Coordinate> | Array.<Array.<ol.Coordinate>>} coordinates
             * @param {ol.geom.SimpleGeometry=} opt_geometry
             * @return {ol.geom.SimpleGeometry}
             */
            geometryFunction = function(coordinates, opt_geometry) {
                var circle = goog.isDef(opt_geometry) ? opt_geometry : new ol.geom.Circle([NaN, NaN]);
                goog.asserts.assertInstanceof(circle, ol.geom.Circle, '初始化geometryFunction中opt_geometry必须是一个ol.geom.Circle');
                /** @type {number} 两点之间距离的平方 */
                var squaredLength = ol.coordinate.squaredDistance(coordinates[0], coordinates[1]);
                /**
                 * 0--圆形的圆心
                 * 1--圆形的半径
                 */
                circle.setCenterAndRadius(coordinates[0], Math.sqrt(squaredLength));
                return circle;
            };
        } else {
            var Constructor;
            var mode = this.mode_;
            if (mode === ol.interaction.DrawMode.POINT) {
                Constructor = ol.geom.Point;
            } else if (mode === ol.interaction.DrawMode.LINE_STRING) {
                Constructor = ol.geom.LineString;
            } else if (mode === ol.interaction.DrawMode.POLYGON) {
                Constructor = ol.geom.Polygon;
            }
            /**
             * @param {ol.Coordinate | Array.<ol.Coordinate> | Array.<Array.<ol.Coordinate>>} coordinates
             * @param {ol.geom.SimpleGeometry=} opt_geometry
             * @return {ol.geom.SimpleGeometry}
             */
            geometryFunction = function(coordinates, opt_geometry) {
                var geometry = opt_geometry;
                if (goog.isDef(geometry)) {
                    geometry.setCoordinates(coordinates);
                } else {
                    geometry = new Constructor(coordinates);
                }
                return geometry;
            };
        }
    }

    /**
     * @type {ol.interaction.DrawGeometryFunctionType}
     * @private
     */
    this.geometryFunction_ = geometryFunction;

    /**
     * 要素的结束坐标，多边形的结束点是其起始点，多义线的结束点是其最后绘制点
     * @type {ol.Coordinate}
     * @private
     */
    this.finishCoordinate_ = null;

    /**
     * 草稿要素，实际最后应该展示在图层上的要素
     * @type {ol.Feature}
     * @private
     */
    this.sketchFeature_ = null;

    /**
     * 草稿点
     * @type {ol.Feature}
     * @private
     */
    this.sketchPoint_ = null;

    /**
     * 草稿坐标集合，当绘制多义线或者多边形时使用
     * @type {ol.Coordinate | Array.<ol.Coordinate> | Array.<Array.<ol.Coordinate>>}
     * @private
     */
    this.sketchCoords_ = null;

    /**
     * 草稿多义线对象，当绘制多边形时使用  
     * @type {ol.Feature}
     * @private
     */
    this.sketchLine_ = null;

    /**
     * 草稿多义线坐标集合，当绘制多边形或者多义线时使用
     * @type {Array.<ol.Coordinate>}
     * @private
     */
    this.sketchLineCoords_ = null;

    /**
     * 容差的平方用于处理UP事件，如果down与up之间的距离的平方大于这个容差的平方
     * 那么，up事件不会被处理
     * @type {number}
     * @private
     */
    this.squaredClickTolerance_ = goog.isDef(opts.clickTolerance) ? opts.clickTolerance * opts.clickTolerance : 36;


    /**
     * 草稿要素绘制的画布（overlay）
     * @type {ol.layer.Vector}
     * @private
     */
    this.overlay_ = new ol.layer.Vector({
        source: new ol.source.Vector({
            useSpatialIndex: false,
            wrapX: goog.isDef(opts.wrapX) ? opts.wrapX : false
        }),
        style: goog.isDef(opts.style) ? opts.style : ol.interaction.Draw2.getDefaultStyleFunction()
    });

    /**
     * 新建要素的地理属性的名字
     * @type {string|undefined}
     * @private
     */
    this.geometryName_ = opts.geometryName;

    /**
     * @type {ol.events.ConditionType}
     * @private
     */
    this.condition_ = goog.isDef(opts.condition) ? opts.condition : ol.events.condition.noModifierKeys;

    /**
     * [freehandCondition_ description]
     * @type {[type]}
     */
    this.freehandCondition_ = goog.isDef(opts.freehandCondition) ? opts.freehandCondition : ol.events.condition.shiftKeyOnly;

    ol.events.listen(this, ol.Object.getChangeEventType(ol.interaction.InteractionProperty.ACTIVE), this.updateState_, false, this);
};
goog.inherits(ol.interaction.Draw2, ol.interaction.Pointer);

ol.interaction.Draw2.prototype.changeStyle_ = function(evt) {
    ol.interaction.Draw2.addClass(this.helpTooltipElement, 'hidden');
};

/**
 * 创建帮助提示工具
 */
ol.interaction.Draw2.prototype.createHelpTooltip = function() {
    if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'tooltip hidden';
    this.helpTooltip = new ol.Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    var map = this.getMap();
    map.addOverlay(this.helpTooltip, true);
};

/**
 * @return {ol.style.StyleFunction} Styles.
 */
ol.interaction.Draw2.getDefaultStyleFunction = function() {
    var styles = ol.style.createDefaultEditingStyles();
    return function(feature, resolution) {
        return styles[feature.getGeometry().getType()];
    };
};


/**
 * @inheritDoc
 */
ol.interaction.Draw2.prototype.setMap = function(map) {
    goog.base(this, 'setMap', map);
    // 用于删除dom元素
    var tempMap = this.map;
    this.updateState_();
    /**
     *
     * 增加提示帮助元素
     *
     */
    if (map) {
        this.map = map;
        if (this.tip_ !== false) {
            this.createHelpTooltip();
            this.changeStyle_ = this.changeStyle_.bind(this);
            map.getViewport().addEventListener('mouseout', this.changeStyle_);
        }
    } else {
        if (this.tip_ !== false) {
            tempMap.removeOverlay(this.helpTooltip, true);
            tempMap.getViewport().removeEventListener('mouseout', this.changeStyle_);
        }
    }
};


/**
 * 处理 {@link ol.MapBrowserEvent}地图浏览器事件，
 * 也许事实上可能处理或者完成了绘制
 * @param  {ol.MapBrowserEvent} mapBrowserEvent
 * @return {boolean} 'false' 用来停止事件传播
 * @this {ol.interaction.Draw2}
 * @api
 */
ol.interaction.Draw2.handleEvent = function(mapBrowserEvent) {

    var pass = !this.freehand_;
    if (this.freehand_ && mapBrowserEvent.type === ol.MapBrowserEvent.EventType.POINTERDRAG) {
        this.addToDrawing_(mapBrowserEvent);
        pass = false;
    } else if (mapBrowserEvent.type === ol.MapBrowserEvent.EventType.POINTERMOVE) {
        pass = this.handlePointerMove_(mapBrowserEvent)
    } else if (mapBrowserEvent.type === ol.MapBrowserEvent.EventType.DBLCLICK) {
        pass = false;
    }
    return ol.interaction.Pointer.handleEvent.call(this, mapBrowserEvent) && pass;
};


/**
 * @param {ol.MapBrowserPointerEvent} event Event.
 * @return {boolean} <Start></Start> drag sequence?
 * @this {ol.interaction.Draw2}
 * @private
 */
ol.interaction.Draw2.handleDownEvent_ = function(event) {

    if (this.condition_(event)) {
        this.downPx_ = event.pixel;
        return true;
    } else if ((this.mode_ === ol.interaction.DrawMode.LINE_STRING ||
            this.mode_ === ol.interaction.DrawMode.POLYGON) && this.freehandCondition_(event)) {
        this.downPx_ = event.pixel;
        this.freehand_ = true;
        if (goog.isNull(this.finishCoordinate_)) {
            this.startDrawing_(event);
        }
        return true;
    } else {
        return false;
    }
};


/**
 * @param {ol.MapBrowserPointerEvent} event Event.
 * @return {boolean} Stop drag sequence?
 * @this {ol.interaction.Draw}
 * @private
 */
ol.interaction.Draw2.handleUpEvent_ = function(event) {

    // 定义鼠标右键跟踪
    var rightClick = (event.pointerEvent.button === 2) ? true : false;

    this.freehand_ = false;
    var downPx = this.downPx_;
    var clickPx = event.pixel;
    var dx = downPx[0] - clickPx[0];
    var dy = downPx[1] - clickPx[1];
    var squaredDistance = dx * dx + dy * dy;
    var pass = true;
    if (squaredDistance <= this.squaredClickTolerance_) {
        this.handlePointerMove_(event);
        if (goog.isNull(this.finishCoordinate_)) {
            this.startDrawing_(event);
            if (this.mode_ === ol.interaction.DrawMode.POINT) {
                this.finishDrawing();
            }
        } else if (this.mode_ === ol.interaction.DrawMode.CIRCLE) {
            this.finishDrawing();
        } else {
            // } else if (this.atFinish_(event) && rightClick) {
            //     this.finishDrawing(rightClick);
            // } else {

            this.addToDrawing_(event);
        }
        pass = false;
    }

    if (rightClick) {
        if (this.atFinish_(event)) {
            this.finishDrawing(rightClick);
        }
    }
    return pass;
};


/**
 * 处理移动事件
 * @param {ol.MapBrowserEvent} event A move event.
 * @return {boolean} Pass the event to other interactions.
 * @private
 */
ol.interaction.Draw2.prototype.handlePointerMove_ = function(event) {
    if (!goog.isNull(this.finishCoordinate_)) {
        this.modifyDrawing_(event);
    } else {
        this.createOrUpdateSketchPoint_(event);
    }

    this.updateTipTool(event, this.startDrawingFlag);

    return true;
};

/**
 * 更新元素的位置和信息
 */
ol.interaction.Draw2.prototype.updateTipTool = function(evt, isStart) {
    /** @type {String} */
    var helpMsg = "点击开始绘制";

    if (isStart && this.type_) {
        var type = this.type_;
        if (type === ol.geom.GeometryType.CIRCLE) {
            helpMsg = "移动确定半径，单击完成绘制";
        } else if (type === ol.geom.GeometryType.LINE_STRING && this.maxPoints_ === 2) {
            helpMsg = "移动确定长度，单击完成绘制";
        } else if (type === ol.geom.GeometryType.LINE_STRING) {
            helpMsg = "单击确定节点，右击完成绘制";
        } else if (type === ol.geom.GeometryType.POLYGON) {
            helpMsg = "单击确定节点，右击完成绘制";
        }
    }

    if (this.tip_) {

        this.helpTooltipElement.innerHTML = helpMsg;
        this.helpTooltip.setPosition(evt.coordinate);

        ol.interaction.Draw2.addClass(this.helpTooltipElement, "hidden");
    }
};


/**
 * 判断是否一个事件是在开始坐标的捕捉容差范围内
 * @param {ol.MapBrowserEvent} event Event.
 * @return {boolean} The event is within the snapping tolerance of the start.
 * @private
 */
ol.interaction.Draw2.prototype.atFinish_ = function(event) {
    var at = false;
    if (!goog.isNull(this.sketchFeature_)) {
        var potentiallyDone = false;
        var potentiallyFinishCoordinates = [this.finishCoordinate_];
        if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
            potentiallyDone = this.sketchCoords_.length > this.minPoints_;
        } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
            potentiallyDone = this.sketchCoords_[0].length > this.minPoints_;
            potentiallyFinishCoordinates = [this.sketchCoords_[0][0], this.sketchCoords_[0][this.sketchCoords_[0].length - 2]];
        }
        if (potentiallyDone) {
            var map = event.map;
            for (var i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
                var finishCoordinate = potentiallyFinishCoordinates[i];
                var finishPixel = map.getPixelFromCoordinate(finishCoordinate);
                var pixel = event.pixel;
                var dx = pixel[0] - finishPixel[0];
                var dy = pixel[1] - finishPixel[1];
                var freehand = this.freehand_ && this.freehandCondition_(event);
                var snapTolerance = freehand ? 1 : this.snapTolerance_;
                at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance;
                if (at) {
                    this.finishCoordinate_ = finishCoordinate;
                    break;
                }
            }
        }
    }
    return at;
};


/**
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw2.prototype.createOrUpdateSketchPoint_ = function(event) {
    var coordinates = event.coordinate.slice();
    if (goog.isNull(this.sketchPoint_)) {
        this.sketchPoint_ = new ol.Feature(new ol.geom.Point(coordinates));
        this.updateSketchFeatures_();
    } else {
        var sketchPointGeom = this.sketchPoint_.getGeometry();
        goog.asserts.assertInstanceof(sketchPointGeom, ol.geom.Point, 'sketchPointGeom should be an ol.geom.Point');
        sketchPointGeom.setCoordinates(coordinates);
    }
};


/**
 * 开始绘制
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw2.prototype.startDrawing_ = function(event) {
    // 定义事件处理map的contextmenu事件
    var map = this.getMap();
    if (!map) return;

    var mapviewport = map.getViewport();

    mapviewport.addEventListener('contextmenu', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.currentTarget.removeEventListener(evt.type, arguments.callee);
        return false;
    });

    var start = event.coordinate;
    this.finishCoordinate_ = start;
    if (this.mode_ === ol.interaction.DrawMode.POINT) {
        this.sketchCoords_ = start.slice();
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
        this.sketchCoords_ = [
            [start.slice(), start.slice()]
        ];
        this.sketchLineCoords_ = this.sketchCoords_[0];
    } else {
        this.sketchCoords_ = [start.slice(), start.slice()];
        if (this.mode_ === ol.interaction.DrawMode.CIRCLE) {
            this.sketchLineCoords_ = this.sketchCoords_;
        }
    }
    if (!goog.isNull(this.sketchLineCoords_)) {
        this.sketchLine_ = new ol.Feature(
            new ol.geom.LineString(this.sketchLineCoords_));
    }
    var geometry = this.geometryFunction_(this.sketchCoords_);
    goog.asserts.assert(goog.isDef(geometry), 'geometry should be defined');
    this.sketchFeature_ = new ol.Feature();
    if (goog.isDef(this.geometryName_)) {
        this.sketchFeature_.setGeometryName(this.geometryName_);
    }
    this.sketchFeature_.setGeometry(geometry);
    this.updateSketchFeatures_();
    this.dispatchEvent(new ol.interaction.DrawEvent(ol.interaction.DrawEventType.DRAWSTART, this.sketchFeature_));
};


/**
 * 更改绘图
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw2.prototype.modifyDrawing_ = function(event) {
    var coordinate = event.coordinate;
    var geometry = this.sketchFeature_.getGeometry();
    goog.asserts.assertInstanceof(geometry, ol.geom.SimpleGeometry, 'geometry should be ol.geom.SimpleGeometry or subclass');
    var coordinates, last;
    if (this.mode_ === ol.interaction.DrawMode.POINT) {
        last = this.sketchCoords_;
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
        coordinates = this.sketchCoords_[0];
        last = coordinates[coordinates.length - 1];
        if (this.atFinish_(event)) {
            // snap to finish
            coordinate = this.finishCoordinate_.slice();
        }
    } else {
        coordinates = this.sketchCoords_;
        last = coordinates[coordinates.length - 1];
    }
    last[0] = coordinate[0];
    last[1] = coordinate[1];
    goog.asserts.assert(!goog.isNull(this.sketchCoords_), 'sketchCoords_ must not be null');
    this.geometryFunction_(this.sketchCoords_, geometry);
    if (!goog.isNull(this.sketchPoint_)) {
        var sketchPointGeom = this.sketchPoint_.getGeometry();
        goog.asserts.assertInstanceof(sketchPointGeom, ol.geom.Point, 'sketchPointGeom should be an ol.geom.Point');
        sketchPointGeom.setCoordinates(coordinate);
    }
    var sketchLineGeom;
    if (geometry instanceof ol.geom.Polygon &&
        this.mode_ !== ol.interaction.DrawMode.POLYGON) {
        if (goog.isNull(this.sketchLine_)) {
            this.sketchLine_ = new ol.Feature(new ol.geom.LineString(null));
        }
        var ring = geometry.getLinearRing(0);
        sketchLineGeom = this.sketchLine_.getGeometry();
        goog.asserts.assertInstanceof(sketchLineGeom, ol.geom.LineString, 'sketchLineGeom must be an ol.geom.LineString');
        sketchLineGeom.setFlatCoordinates(ring.getLayout(), ring.getFlatCoordinates());
    } else if (!goog.isNull(this.sketchLineCoords_)) {
        sketchLineGeom = this.sketchLine_.getGeometry();
        goog.asserts.assertInstanceof(sketchLineGeom, ol.geom.LineString, 'sketchLineGeom must be an ol.geom.LineString');
        sketchLineGeom.setCoordinates(this.sketchLineCoords_);
    }
    this.updateSketchFeatures_();
    this.startDrawingFlag = true;
};


/**
 * 增加一个新的坐标到绘图.
 * @param {ol.MapBrowserEvent} event Event.
 * @private
 */
ol.interaction.Draw2.prototype.addToDrawing_ = function(event) {
    var coordinate = event.coordinate;
    var geometry = this.sketchFeature_.getGeometry();
    goog.asserts.assertInstanceof(geometry, ol.geom.SimpleGeometry, 'geometry must be an ol.geom.SimpleGeometry');
    var done;
    var coordinates;
    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
        this.finishCoordinate_ = coordinate.slice();
        coordinates = this.sketchCoords_;
        coordinates.push(coordinate.slice());
        done = coordinates.length > this.maxPoints_;
        this.geometryFunction_(coordinates, geometry);
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
        coordinates = this.sketchCoords_[0];
        coordinates.push(coordinate.slice());
        done = coordinates.length > this.maxPoints_;
        if (done) {
            this.finishCoordinate_ = coordinates[0];
        }
        this.geometryFunction_(this.sketchCoords_, geometry);
    }
    this.updateSketchFeatures_();
    if (done) {
        this.finishDrawing();
    }
};


/**
 * 停止绘图，然后增加草稿要素到目标图层.
 * The {@link ol.interaction.DrawEventType.DRAWEND} event is dispatched before
 * inserting the feature.
 * @api
 */
ol.interaction.Draw2.prototype.finishDrawing = function(isRightClick) {
    var sketchFeature = this.abortDrawing_();
    goog.asserts.assert(!goog.isNull(sketchFeature), 'sketchFeature should not be null');
    var coordinates = this.sketchCoords_;
    var geometry = sketchFeature.getGeometry();
    goog.asserts.assertInstanceof(geometry, ol.geom.SimpleGeometry, 'geometry must be an ol.geom.SimpleGeometry');
    if (this.mode_ === ol.interaction.DrawMode.LINE_STRING) {
        // remove the redundant last point
        coordinates.pop();
        if (isRightClick) {
            coordinates.pop();
        }
        this.geometryFunction_(coordinates, geometry);
    } else if (this.mode_ === ol.interaction.DrawMode.POLYGON) {
        // When we finish drawing a polygon on the last point,
        // the last coordinate is duplicated as for LineString
        // we force the replacement by the first point
        coordinates[0].pop();
        if (isRightClick) {
            coordinates[0].pop();
        }
        coordinates[0].push(coordinates[0][0]);
        this.geometryFunction_(coordinates, geometry);
    }

    // cast multi-part geometries
    if (this.type_ === ol.geom.GeometryType.MULTI_POINT) {
        sketchFeature.setGeometry(new ol.geom.MultiPoint([coordinates]));
    } else if (this.type_ === ol.geom.GeometryType.MULTI_LINE_STRING) {
        sketchFeature.setGeometry(new ol.geom.MultiLineString([coordinates]));
    } else if (this.type_ === ol.geom.GeometryType.MULTI_POLYGON) {
        sketchFeature.setGeometry(new ol.geom.MultiPolygon([coordinates]));
    }

    // First dispatch event to allow full set up of feature
    this.dispatchEvent(new ol.interaction.DrawEvent(ol.interaction.DrawEventType.DRAWEND, sketchFeature));

    // Then insert feature
    if (!goog.isNull(this.features_)) {
        this.features_.push(sketchFeature);
    }
    if (!goog.isNull(this.source_)) {
        /**
         * @author qianleyi
         * @description 绘制完成后不再向图层上添加图形，又用户自己确定操作
         */
        //this.source_.addFeature(sketchFeature);
    }

    var map = this.map;
    if (this.tip_ !== false) {
        map.removeOverlay(this.helpTooltip, true);
        this.helpTooltip = null;
    }

    map.getViewport().removeEventListener('mouseout', this.changeStyle_);
    delete this.map;
};


/**
 * 停止绘制，并且不再增加要素到目标图层.
 * @return {ol.Feature} The sketch feature (or null if none).
 * @private
 */
ol.interaction.Draw2.prototype.abortDrawing_ = function() {
    this.finishCoordinate_ = null;
    var sketchFeature = this.sketchFeature_;
    if (!goog.isNull(sketchFeature)) {
        this.sketchFeature_ = null;
        this.sketchPoint_ = null;
        this.sketchLine_ = null;
        this.overlay_.getSource().clear(true);
    }
    return sketchFeature;
};


/**
 * @inheritDoc
 */
ol.interaction.Draw2.prototype.shouldStopEvent = goog.functions.FALSE;


/**
 * 重新绘制草稿要素.
 * @private
 */
ol.interaction.Draw2.prototype.updateSketchFeatures_ = function() {
    var sketchFeatures = [];
    if (!goog.isNull(this.sketchFeature_)) {
        sketchFeatures.push(this.sketchFeature_);
    }
    if (!goog.isNull(this.sketchLine_)) {
        sketchFeatures.push(this.sketchLine_);
    }
    if (!goog.isNull(this.sketchPoint_)) {
        sketchFeatures.push(this.sketchPoint_);
    }
    var overlaySource = this.overlay_.getSource();
    overlaySource.clear(true);
    overlaySource.addFeatures(sketchFeatures);
};


/**
 * @private
 */
ol.interaction.Draw2.prototype.updateState_ = function() {
    var map = this.getMap();
    var active = this.getActive();
    if (goog.isNull(map) || !active) {
        this.abortDrawing_();
    }
    this.overlay_.setMap(active ? map : null);
};


/**
 * Create a `geometryFunction` for `mode: 'Circle'` that will create a regular
 * polygon with a user specified number of sides and start angle instead of an
 * `ol.geom.Circle` geometry.
 * @param {number=} opt_sides Number of sides of the regular polygon. Default is
 *     32.
 * @param {number=} opt_angle Angle of the first point in radians. 0 means East.
 *     Default is the angle defined by the heading from the center of the
 *     regular polygon to the current pointer position.
 * @return {ol.interaction.DrawGeometryFunctionType} Function that draws a
 *     polygon.
 * @api
 */
ol.interaction.Draw2.createRegularPolygon = function(opt_sides, opt_angle) {
    return (
        /**
         * @param {ol.Coordinate|Array.<ol.Coordinate>|Array.<Array.<ol.Coordinate>>} coordinates
         * @param {ol.geom.SimpleGeometry=} opt_geometry
         * @return {ol.geom.SimpleGeometry}
         */
        function(coordinates, opt_geometry) {
            var center = coordinates[0];
            var end = coordinates[1];
            var radius = Math.sqrt(ol.coordinate.squaredDistance(center, end));
            var geometry = goog.isDef(opt_geometry) ? opt_geometry : ol.geom.Polygon.fromCircle(new ol.geom.Circle(center), opt_sides);
            goog.asserts.assertInstanceof(geometry, ol.geom.Polygon, 'geometry must be a polygon');
            var angle = goog.isDef(opt_angle) ? opt_angle : Math.atan((end[1] - center[1]) / (end[0] - center[0]));
            ol.geom.Polygon.makeRegular(geometry, center, radius, angle);
            return geometry;
        }
    );
};


/**
 * Get the drawing mode.  The mode for mult-part geometries is the same as for
 * their single-part cousins.
 * @param {ol.geom.GeometryType} type Geometry type.
 * @return {ol.interaction.DrawMode} Drawing mode.
 * @private
 */
ol.interaction.Draw2.getMode_ = function(type) {
    var mode;
    if (type === ol.geom.GeometryType.POINT || type === ol.geom.GeometryType.MULTI_POINT) {
        mode = ol.interaction.DrawMode.POINT;
    } else if (type === ol.geom.GeometryType.LINE_STRING || type === ol.geom.GeometryType.MULTI_LINE_STRING) {
        mode = ol.interaction.DrawMode.LINE_STRING;
    } else if (type === ol.geom.GeometryType.POLYGON || type === ol.geom.GeometryType.MULTI_POLYGON) {
        mode = ol.interaction.DrawMode.POLYGON;
    } else if (type === ol.geom.GeometryType.CIRCLE) {
        mode = ol.interaction.DrawMode.CIRCLE;
    }
    goog.asserts.assert(goog.isDef(mode), 'mode should be defined');
    return mode;
};

/**
 * 工具函数用于增加CLASS
 * @param {Element} element - 目标要素
 * @param {String} cls - className
 */
ol.interaction.Draw2.addClass = function(element, cls) {
    var clsnames = element.className.split(' ');
    for (var i = 0; i < clsnames.length; i++) {
        if (clsnames[i] === cls.trim()) {
            return;
        }
    }
    clsnames.push(cls.trim());
    element.className = clsnames.join(' ');
};

ol.interaction.Draw2.removeClass = function(element, cls) {
    var classnames = element.className;
    var clsArr = classnames.split(' ');
    for (var i = 0; i < clsArr.length; i++) {
        if (clsArr[i] === cls) {
            clsArr[i] = '';
            break;
        }
    }
    var newClassName = clsArr.join(" ");
    element.className = newClassName;
};
