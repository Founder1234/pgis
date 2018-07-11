/*
|------------------------------------------------------------------------------
|                                Ez.animation.InteropFn                
|
|@author: qianleyi
|@date: 2016-08-19
|@descript: 插值算子,枚举对象
|------------------------------------------------------------------------------
*/
goog.provide('Ez.animation.InteropFn');

/**
 * 插值算子枚举
 * @type {Enum}
 */
Ez.animation.InteropFn = {
    'linear': linear,
    'radius': radius
};

/**
 * 线性函数，返回y=f(x)的函数
 * @param  {Number} x1 坐标点1的X坐标
 * @param  {Number} y1 坐标点1的Y坐标
 * @param  {Number} x2 坐标点2的X坐标
 * @param  {Number} y2 坐标点2的Y坐标
 * @return {Function}  拟合的线性函数，唯一的x生成唯一的y
 */
function linear(x1, y1, x2, y2) {
    var a_value = (y2 - y1) / (x2 - x1);
    var b_value = (x2 * y1 - x1 * y2) / (x2 - x1);
    if (Math.abs(a_value) === Infinity) {
        return Infinity;
    }

    return function(x) {
        return a_value * x + b_value;
    }
}


function radius() {}
