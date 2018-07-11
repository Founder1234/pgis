/*
|------------------------------------------------------------------------------
|                              Ez.animation.Translate                
|
|@author: qianleyi
|@date: 2016-08-19
|@descript: 移动变化时间线
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.Translate');

goog.require('Ez.animation.Transition');

Ez.animation.Translate = function(duration, atttibute, startState, endState, options) {

    var opts = options ? options : {};

    var type = opts.type ? opts.type : 'linear';

    goog.base(this, duration, atttibute, startState, endState, Object.assign({}, opts, { type: type }));
};
goog.inherits(Ez.animation.Translate, Ez.animation.Transition);

Ez.animation.Translate.prototype.generateTransition = function(feature, now) {
    var nowTime = now;
    var startX = this.stateOfStart_.getCoordinate()[0];
    var endX = this.stateOfEnd_.getCoordinate()[0];
    var duration = this.getDuration();
    var fps = this.getFPS();
    var interopfn = this.generateInteropfn();
    var line = this.generateLine(this.stateOfStart_.getCoordinate(), this.stateOfEnd_.getCoordinate(), duration, this.getFPS(), interopfn);
    var self = this;

    return function(evt) {
        var frameState = evt.frameState;
        var map = evt.target;
        var elapsedTime = frameState.time - nowTime;

        var index = Math.round(elapsedTime / (1000 / fps));

        if (index >= 1) {

            if (index >= line.length) {
                return true;
            }

            feature.getGeometry().setCoordinates(line[index]);
            // tell OL3 to continue the postcompose animation
            map.render();
        }
    };
};

Ez.animation.Translate.prototype.generateLine = function(start, end, duration, fps, interopfn) {
    var times = duration / (1000 / fps);
    var interval;
    if (interopfn === Infinity) {
        interval = (end[1] - start[1]) / (times > 0 ? times : 0);
    } else {
        interval = (end[0] - start[0]) / (times > 0 ? times : 0);
    }
    var arr = [];
    arr.push(start);
    var x_value, y_value;
    for (var i = 1; i < times + 1; i++) {
        if (interopfn === Infinity) {
            x_value = start[0];
            y_value = start[1] + interval * i;
        } else {
            x_value = start[0] + interval * i;
            y_value = interopfn(x_value);
        }
        arr.push([x_value, y_value]);
    }
    arr.push(end);
    return arr;
};
