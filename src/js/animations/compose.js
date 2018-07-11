/*
|------------------------------------------------------------------------------
|                                Ez.animation.Compose                
|
|@author: qianleyi
|@date: 2016-08-25
|@descript: 合成动画，合成动画基类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Compose');
goog.provide('Ez.animation.ComposeEvent');

Ez.animation.ComposeEvent = function(type, time) {
    goog.base(this, type);

    /**
     * 时间点
     * @type {Date}
     */
    this.time = time;
};
goog.inherits(Ez.animation.ComposeEvent, ol.events.Event);

/**
 * 合成动画基类，动画相关属性以及方法
 * @param {Ez.Overlay} feature 动画要素类
 * @param {Ez.animation.Transition[]} transitions 单轨动画属性
 * @constructor
 * @extends {ol.Object}
 */
Ez.animation.Compose = function(feature, transitions) {
    goog.base(this);

    /**
     * @type {Ez.Overlay[]}
     * @private
     */
    this.feature_ = feature;

    /**
     * @type{Ez.animation.Transition[]}
     * @private
     */
    this.transitions_ = transitions;

    /**
     * 地图对象，指定渲染器
     * @type {Ez.Map}
     */
    this.map_ = null;

    /**
     * 开始动画的时间戳，每一次play都需要更新该时间戳，初始为null
     * @type {Date}
     */
    this.now_ = null;

    /**
     * 当前动画的状态"PLAY"|"PAUSE"|"STOP"
     * @type {String}
     */
    this.status_ = "STOP";

    /**
     * 当前进行着的transition
     * @type {Object}
     */
    this.transition_ = null;

    /**
     * 动画累计进行时间
     * @type {Number}
     */
    this.animationTimer_ = 0;
};
goog.inherits(Ez.animation.Compose, ol.Object);

/**
 * 设置地图对象
 * @param {Ez.Map} map
 */
Ez.animation.Compose.prototype.setRefreshController = function(map) {
    this.map_ = map;
};

/**
 * 开始动画展示
 */
Ez.animation.Compose.prototype.play = function() {
    // 如果当前正在play就直接返回
    if (this.status_ === "PLAY") return;

    var feature = this.feature_;
    var map = this.map_;

    if (this.status_ === "PAUSE") {
        var first = this.transitions_[0];
        var point = feature.getPoint();
        var duration = first.getDuration();
        // 计算剩下的时间间隔
        var extraDuration = duration - (new Date().getTime() - this.now_ - this.animationTimer_);
        this.transitions_[0].setDuration(extraDuration);
        this.transitions_[0].setStartState(point);
    }
    this.status_ = "PLAY";
    var now = this.now_ = new Date().getTime();

    var transition = this.generateTransition(feature, now)
    this.on('animation:end', function() {
        map.un('postcompose', transition);
    });
    this.on('animation:control:pause', function() {
        map.un('postcompose', transition);
    });
    map.on('postcompose', transition);
    this.dispatchEvent(new Ez.animation.ComposeEvent('animation:start', new Date().getTime()));
    map.render();
};

/**
 * 暂停动画
 */
Ez.animation.Compose.prototype.pause = function() {
    this.status_ = "PAUSE";
    this.dispatchEvent(new Ez.animation.ComposeEvent('animation:control:pause'));
};
