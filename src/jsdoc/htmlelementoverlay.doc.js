/**
 * 在地图上添加自定义的HTML要素类.由于地图客户端使用CANVAS渲染技术,所以,HTMLElmentOverLay对象又客户端生成一个父容器DIV(用户需要提供父容器的id号),strHTML信息会转换为DOM追加到父容器中.故,HTMLElementOverlay是以DOM的形式存在,用户可以使用普通的浏览器接口处理它
 * @constructor
 * @param {String} id          - 父容器id号
 * @param {EzCoord} coord      - 地理坐标
 * @param {String} strHTML     - innerHTML内容
 * @param {Number[]} [offset=[0,0]]  - HTMLElementOverlay偏移量
 * @param {String} [positioning] - HTMLElementOverlay的定位点,默认为左上角	
 */
var HTMLElementOverLay = function(id , coord , strHTML , offset , positioning) {};

HTMLElementOverLay.prototype = 
/** @lends HTMLElementOverLay.prototype */
{
	/**
	 * 获取HTMLElementOverlay要素的地理位置
	 * @param  {Boolean} isArray - 是否返回数组坐标
	 * @return {EzCoord|Number[]} 地理坐标
	 */
	getPos: function(isArray){},

	/**
	 * 设置HTMLElementOverlay要素的地理位置
	 * @param {EzCoord|Number[]} coord - 地理坐标
	 */
	setPos: function(coord){},
};