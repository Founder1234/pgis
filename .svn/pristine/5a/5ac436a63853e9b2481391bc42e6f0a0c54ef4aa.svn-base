/*
|------------------------------------------------------------------------------
|                                Ez.animation.Parallel                
|
|@author: qianleyi
|@date: 2016-08-18
|@descript: 合成动画类，并行动画处理
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Parallel');

goog.require('Ez.animation.Compose');
goog.require('Ez.animation.ComposeEvent');

/**
 * 并行动画处理控制器
 * @param {Ez.Overlay} feature   要素叠加类
 * @param {Ez.animation.Transition[]} transitions 变换时间线数组
 * @constructor
 * @extends {Ez.animation.Compose}
 */
Ez.animation.Parallel = function(feature, transitions) {
    goog.base(this, feature, transitions);
};
goog.inherits(Ez.animation.Parallel, Ez.animation.Compose);

/**
 * 合成动画生成合成变换过程
 * @param  {Ez.Overlay} feature
 * @param  {Number} now 
 * @return {Function} 并发处理函数组
 */
Ez.animation.Parallel.prototype.generateTransition = function(feature, now) {
    var transitions = this.transitions_;
    var maxDuration;
    transitions.forEach(function(e, index) {
        if (index === 0) { maxDuration = e.getDuration(); }
        if (maxDuration < e.getDuration()) { maxDuration = e.getDuration(); }
    });
    var transitioncallbacks = transitions.map(function(ele) {
        return ele.generateTransition(feature, now);
    });
    var n = 0;
    var self = this;
    return function(evt) {
        var elapsedTime = evt.frameState.time - now;
        transitioncallbacks.forEach(function(el, i, arr) {
            if (el(evt)) {
                n++;
            }
            if (n === arr.length) {
                if (elapsedTime >= maxDuration) {
                    this.status_ = false;
                    self.dispatchEvent(new Ez.animation.ComposeEvent('animation:end'));
                }
            }
        });
    };
};
