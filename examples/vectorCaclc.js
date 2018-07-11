var rotationCalc = function(start, center, end) {
    // vector a
    var v_a_x = start[0] - center[0];
    var v_a_y = start[1] - center[1];
    // vector b
    var v_b_x = end[0] - center[0];
    var v_b_y = end[1] - center[1];
    // 计算向量之间的模
    var v_mod_a = Math.sqrt(v_a_x * v_a_x + v_a_y * v_a_y);
    var v_mod_b = Math.sqrt(v_b_x * v_b_x + v_b_y * v_b_y);
    // 计算两向量之间的点积
    var v_a_b = v_a_x * v_b_x + v_a_y * v_b_y;
    // 计算两个向量之间的余弦值
    var cos_v = v_a_b / (v_mod_a * v_mod_b);

    return Math.acos(cos_v);
};

function rotationCalc2(start, end) {
    // 计算两点之间的差值
    var dy = end[1] - start[1];
    var dx = end[0] - start[0];
    // 计算反正切值
    var atan = Math.abs(dy) / Math.abs(dx);
    var a = null;
    // 坐标象限判断
    if (dy > 0 && dx >= 0) a = Math.atan(atan);
    else if (dy < 0 && dx >= 0) a = Math.PI / 2 + Math.atan(atan);
    else if (dy < 0 && dx < 0) a = Math.PI + Math.atan(atan);
    else if (dy > 0 && dx < 0) a = 3 * Math.PI / 2 + Math.atan(atan);
    else if (dy === 0 && dx > 0) a = Math.PI / 2;
    else if (dy === 0 && dx < 0) a = 3 * Math.PI / 2;

    if (a) {
        a = a + Math.PI / 2;
        if (a > 2 * Math.PI) {
            a = a - 2 * Math.PI;
            return a;
        } else if (a > Math.PI) {
            a = 2 * Math.PI - a;
        } else {
            return a;
        }
    } else {
        return null;
    }
};

var startPoint = [116.34765, 39.99921];
var centerPoint = [116.44765, 39.99921];
var endPoint = [116.55765, 39.79921];

var vv = wayRotateCacl(centerPoint, endPoint);

console.log(vv);
