/**
 * 地理坐标类,用来存储地理坐标对象,并且提供相关地理坐标计算方法
 * @constructor
 * @param {Number} x - 大地经度
 * @param {Number} y - 大地纬度
 * @extends {olClass.coordinate}
 */
var EzCoord = function(x,y){};

EzCoord.prototype = 
/** @lends EzCoord.prototype */
{
	/**
	 * 获取数组格式的地理坐标
	 * @return {Number[]} 地理坐标数组
	 */
	getCoordinate: function(){},

	/**
	 * 获取序列化后地理坐标字符串
	 * @return {String} 地理坐标字符串
	 */
	toStringXY: function(){},
	
	/**
	 * 计算两坐标点之间的距离
	 * @param  {EzCoord} destCoord
	 * @return {Number}
	 */
	distanceTo: function(){}
};