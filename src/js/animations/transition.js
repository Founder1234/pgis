/*
|------------------------------------------------------------------------------
|                                Ez.animation.Transition                
|
|@author: qianleyi
|@date: 2016-08-19
|@descript: 基本的时间线类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Transition');

//goog.require('Ez.animation.InteropFn');

Ez.animation.Transition = function(duration, atttibute, startState, endState, options) {
    goog.base(this);

    var opts = options ? options : {};

    /**
     * 动画持续时间,默认0
     * @type {Number}
     */
    this.duration_ = duration || 0;

    /**
     * 要进行变换的要素属性
     * @type {String|null}
     */
    this.atttibute_ = atttibute || null;

    /**
     * 动画起始状态
     * @type {Number|String|Object|null}
     */
    this.stateOfStart_ = startState || null;

    /**
     * 动画结束状态
     * @type {Number|String|Object|null}
     */
    this.stateOfEnd_ = endState || null;

    /**
     * 插值类型，默认为线性插值--'linear'
     * @type {String} 'linear'
     */
    var type = opts.interoptype ? opts.interoptype : 'linear';

    /**
     * 插值算子
     * @type {Function}
     */
    this.interopFn_ = opts.interopfn ? opts.interopfn : Ez.animation.InteropFn[type];

    /**
     * 视频帧数
     * @type {Number}
     */
    this.fps_ = opts.fps ? opts.fps : 60;
};
goog.inherits(Ez.animation.Transition, ol.Object);

Ez.animation.Transition.prototype.generateInteropfn = function() {
    var interopfn = this.interopFn_;
    var start = this.stateOfStart_.getCoordinate();
    var end = this.stateOfEnd_.getCoordinate();
    return interopfn(start[0], start[1], end[0], end[1]);
};

Ez.animation.Transition.prototype.getDuration = function() {
    return this.duration_;
};

Ez.animation.Transition.prototype.setDuration = function(duration) {
    if (duration) {
        this.duration_ = duration;
    }
};

Ez.animation.Transition.prototype.getFPS = function() {
    return this.fps_;
};

Ez.animation.Transition.prototype.setStartState = function(startState) {
    if (startState) {
        this.stateOfStart_ = startState;
    }
};
