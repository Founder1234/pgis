/**
 * Marker叠加要素类
 * @constructor
 * @param  {EzCoord} coord - 地理坐标
 * @param  {EzIcon} [icon=default] - Icon对象,默认由系统提供
 * @param  {EzTitle} [title=null] - Title对象,标题
 * @param  {Object} options - 其他属性
 * @param  {Boolean} options.draggable=false - 是否标记为可拖拽属性
 */
var EzMarker = function(coord, icon, title, options) {};

EzMarker.prototype =
    /** @lends EzMarker.prototype */
    {
        /**
         * 通过Marker对象打开一个POPUP
         * @param  {String} strHTML - HTML内容字符序列化
         * @param  {EzCoord|Number[]} coord - 地理坐标
         * @param  {Object} [options] - 设置POPUP参数
         * @param  {String} options.customStyle - POPUP的最外层CSSClass,用户可以根据需要自定义POPUP样式
         */
        openInfoWindow: function(strHTML, coord, options) {},

        /**
         * 关闭由Marker对象打开的POPUP
         */
        closeInfoWindow: function() {},

        /**
         * 获取marker的Icon图片
         * @return {Elment} Dom对象
         */
        getImage: function() {},

        /**
         * 获取Marker的地理坐标
         * @return {EzCoord} EzCoord地理坐标对象
         */
        getPoint: function() {},

        /**
         * 设置Marker的新地理位置
         * @param {EzCoord} coord - EzCoord地理坐标对象
         */
        setPoint: function(coord) {},

        /**
         * 显示当前要素
         */
        show: function() {},

        /**
         * 隐藏当前要素
         */
        hide: function() {},

        /**
         * 在Marker的顶部显示Title
         */
        showTitle: function() {},

        /**
         * 隐藏Markr显示的Title
         */
        hideTitle: function() {},

        /**
         * 获取Marker的Icon对象
         * @return {EzIcon}
         */
        getIcon: function() {},

        /**
         * 设置Marker的Icon对象
         * @param {EzIcon} icon
         */
        setIcon: function(icon) {}
    };
