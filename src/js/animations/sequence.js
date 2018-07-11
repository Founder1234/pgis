/*
|------------------------------------------------------------------------------
|                                Ez.animation.Sequence               
|
|@author: qianleyi
|@date: 2016-08-25
|@descript: 合成动画，串行动画处理
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Sequence');

goog.require('Ez.animation.Compose');
goog.require('Ez.animation.ComposeEvent');

/**
 * 串行动画处理控制器
 * @param {Ez.Overlay} feature
 * @param {Ez.animation.Transition[]} transitions
 * @constructor
 * @extends {Ez.animation.Compose}
 */
Ez.animation.Sequence = function(feature, transitions) {
    goog.base(this, feature, transitions);
};
goog.inherits(Ez.animation.Sequence, Ez.animation.Compose);

Ez.animation.Sequence.prototype.calcSumDur = function(now, a, index) {
    if (index < 0) {
        return now;
    } else {
        return a[index].getDuration() + this.calcSumDur(now, a, index - 1);
    }
};

/**
 * 合成动画生成合成变换过程
 * @param  {Ez.Overlay} feature
 * @param  {Number} now 
 * @return {Function} 串行处理函数组
 */
Ez.animation.Sequence.prototype.generateTransition = function(feature, now) {
    var transitions = this.transitions_;
    var self = this;
    // 定义一个序列，表示完成与否
    // var sequence = transitions.map(function() {
    //     return false;
    // });
    var transitioncallbacks = transitions.map(function(ele, i, arr) {
        var timer = self.calcSumDur(now, arr, i - 1);
        return ele.generateTransition(feature, timer);
    });
    return function(evt) {
        // if (!sequence[n]) {
        //     if (transitioncallbacks[n](evt)) {
        //         sequence[n] = true;
        //         n++;
        //         evt.target.render();
        //     }
        // }
        if (transitioncallbacks[0](evt)) {
            transitioncallbacks.splice(0, 1);
            var transition = transitions.splice(0, 1);
            self.animationTimer_ += transition[0].getDuration();
            evt.target.render();
        }
        if (0 === transitioncallbacks.length) {
            this.status_ = "STOP";
            self.dispatchEvent(new Ez.animation.ComposeEvent('animation:end', evt.frameState.time));
        }
    };
};
