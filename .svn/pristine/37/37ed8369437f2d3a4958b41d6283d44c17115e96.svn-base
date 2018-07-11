/*
|------------------------------------------------------------------------------
|                                Ez.animation.Rotate                
|
|@author: qianleyi
|@date: 2016-08-22
|@descript: 单轨动画，icon旋转
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Rotate');

Ez.animation.Rotate = function(duration, atttibute, startState, endState, isRight, options) {

    var opts = options ? options : {};

    var type = opts.type ? opts.type : 'radius';

    goog.base(this, duration, atttibute, startState, endState, Object.assign({}, opts, { type: type }));

    /**
     * 是否按照顺时针旋转
     * @type {Boolean}
     */
    this.isRight_ = goog.isDef(isRight) ? isRight : true;
};
goog.inherits(Ez.animation.Rotate, Ez.animation.Transition);

Ez.animation.Rotate.prototype.generateTransition = function(feature, now) {
    var nowTime = now;
    var start = this.stateOfStart_;
    var end = this.stateOfEnd_;
    var duration = this.getDuration();
    var fps = this.getFPS();
    var rads = this.generateRad(start, end, duration, fps);
    var self = this;

    return function(evt) {
        var frameState = evt.frameState;
        var map = evt.target;
        var elapsedTime = frameState.time - nowTime;

        var index = Math.round(elapsedTime / (1000 / fps));

        if (index >= 1) {

            if (index >= rads.length) {
                return true;
            }

            var style = feature.getStyle();
            var icon = style.getImage();
            icon.setRotation(rads[index]);
            feature.setStyle(style);
        }
    };
};

Ez.animation.Rotate.prototype.generateRad = function(start, end, duration, fps) {
    var times = duration / (1000 / fps);
    var isRight = this.isRight_;
    // 返回正确的顺时针旋转开始与结束弧度状态
    if (isRight) {
        var rightVal = this.radianClockwise_(start, end);
        start = rightVal.start;
        end = rightVal.end;
    } else {
        var leftVal = this.radianUnClockwise_(start, end);
        start = leftVal.start;
        end = leftVal.end;
    }
    var interval = (end - start) / (times > 0 ? times : 0);
    var arr = [];
    arr.push(start);
    for (var i = 1; i < times + 1; i++) {
        var rad;
        rad = start + interval * i;
        arr.push(rad);
    }
    arr.push(end);
    return arr;
};

Ez.animation.Rotate.prototype.radianClockwise_ = function(start, end) {
    var diff = end - start;
    if (diff >= 0) {
        return { start: start, end: end };
    } else {
        return { start: start, end: 2 * Math.PI + end }
    }
};

Ez.animation.Rotate.prototype.radianUnClockwise_ = function(start, end) {
    var diff = end - start;
    if (diff >= 0) {
        return { start: start, end: -2 * Math.PI + end }
    } else {
        return { start: start, end: end };
    }
};
