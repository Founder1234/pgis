/**
 * 地图客户端的核心类，提供基础地图功能
 * @example
 * //引入EzMapAPI.js后:
 * var map = new EzMap('map'); //'map'为div容器,一句话即可显示地图
 *
 * //没有引入EzMapAPI.js后:
 * var map = new EzMap('map',{
 *  'mapCenter': [116,38],
 *  ...
 * });
 * ... //需要配置图层等方可显示地图
 * 
 * @constructor
 * @param {String} containerID - 地图容器的id号
 * @param {Object} [opts_map] - 地图配置参数,在没有引用EzMapAPI.js文件时需要手动配置地图参数(专业程度较高),也可以使用EzMapAPI.js来快速配置
 * @param {Number[]|EzCoord} opts_map.mapCenter=null - 地图初始化时的中心点地理坐标
 * @param {String} opts_map.projection='EPSG:3857' - 地图框架的投影参考,默认为'EPSG:3857'
 * @param {Number} opts_map.mapInitLevel=10 - 地图初始化时的地图缩放级别大小
 * @param {Number} opts_map.mapMaxLevel=2 - 地图最大缩放级别值
 * @param {Number} opts_map.mapMinLevel=18 - 地图最小缩放级别值
 * @param {Boolean} opts_map.loadTilesWhileAnimating=false - 动画时是否提前加载瓦片
 * @param {Boolean} opts_map.indoor=false 设置为true以后可以在runtime中构建第二个EzMap对象，用于操作室内地图
 * @extends {olClass.Map}
 */
var EzMap = function(containerID, opts_map) {};

/**
 * @event {@link Ez.Event.Map_CLICK}
 */

EzMap.prototype =
    /** @lends EzMap.prototype */
    {
        /**
         * 添加图层到地图
         * @param {EzTileLayer} layer - 向地图上添加图层
         */
        addLayer: function(layer) {},

        /**
         * 删除图层
         * @param  {EzTileLayer} layer - 从地图上删除图层
         */
        removeLayer: function(layer) {},

        /**
         * 添加叠加要素到地图
         * @param {EzOverlay} layer - 向地图上添加叠加要素
         */
        addOverlay: function(layer) {},

        /**
         * 删除叠加要素
         * @param  {EzOverlay} layer - 从地图上删除叠加要素
         */
        removeOverlay: function(layer) {},

        /**
         * 添加地图事件监听
         * @param {Ez.Event|Ez.Event[]|String|String[]} eventType - 事件类型
         * @param {Function} handler - 事件处理器
         * @param {Object} handler.MapEvent - 地图事件对象
         * @param {Scope} [scope] - 处理器函数作用域
         * @returns {String} 唯一的事件监听器id
         */
        addMapEventListener: function(eventType, handler, scope) {},

        /**
         * 添加地图事件监听,触发一次后,移除事件监听
         * @param {Ez.Event|Ez.Event[]|String|String[]} eventType - 事件类型
         * @param {Function} handler - 事件处理器
         * @param {Object} handler.MapEvent - 地图事件对象
         * @param {Scope} [scope] - 处理器函数作用域
         * @returns {String} 唯一的事件监听器id
         */
        addMapEventListenerOnce: function(eventType, handler, scope) {},

        /**
         * 移除事件监听
         * @param  {String} eventUniqueId - 通过添加事件监听返回的唯一标识码
         */
        removeMapEventListener: function(eventUniqueId) {},

        /**
         * 平移动画函数,为防止白图出现,需要配置EzMapAPI中的参数loadTilesWhileAnimating为true
         * @param  {EzCoord} location - 地理坐标对象
         * @param  {String} type - 动画方式: 'pan','fly','spiral'
         * @param  {Object} opts_animation - 动画参数
         * @param  {Number} opts_animation.duration=2000 - 动画持续时间,单位为ms
         */
        animationTo: function(location, type, opts_animation) {},

        /**
         * 平移地图到指定位置
         * @param  {EzCoord|Number[]} location - 地理坐标
         */
        centerAtLatlng: function(location) {},

        /**
         * 平移地图到指定位置,同时缩放地图到指定级别
         * @param  {EzCoord} location - 地理坐标
         * @param  {Number} zoomLevel - 地图缩放级别
         */
        centerAndZoom: function(location, zoomLevel) {},

        /**
         * 根据包络框范围平移及缩放地图,使得当前窗口近似包络框边界
         * @param  {EzMBR|Number[]} mbr - 地图包络框
         */
        centerAtMBR: function(mbr) {},

        /**
         * 动态绘图接口
         * @param  {String}   mode - 绘图方式:'drawPoint','drawPolyline','drawPolygon','drawCircle','drawRect'; 测量方式: 'measureLine','measureArea'; 编辑方式: 'editGeometry', 'editCircle'. **具体可参考示例演示**
         * @param  {Function} fn - 绘制完成时需要触发的行为
         * @param  {EzOverlay} fn.drawObject - 绘制完成时的叠加要素对象
         */
        changeDragMode: function(mode, fn) {},

        /**
         * 获取当前地图中心坐标
         * @return {EzCoord} 地理坐标
         */
        getCenter: function() {},

        /**
         * 获取当前地图级别大小
         * @return {Number} 地图级别
         */
        getZoom: function() {},

        /**
         * 获取当前地图窗口包络框  
         * @return {EzMBR} 地图包络框
         */
        getBoundsLatLng: function() {},

        /**
         * 在地图上打开一个POPUP
         * @param  {String} strHTML - HTML内容字符序列化
         * @param  {EzCoord|Number[]} coord - 地理坐标
         * @param  {Object} options - POPUP的可选参数设置
         * @param  {String} options.customStyle - POPUP的最外层CSSClass,用户可以根据需要自定义POPUP样式
         */
        openInfoWindow: function(strHTML, coord, options) {},

        /**
         * 关闭已经打开的POPUP
         */
        closeInfoWindow: function() {},

        /**
         * 显示丰富的地图级别组件,包括:导航控件以及地图级别控制条
         */
        showMapControl: function() {},

        /**
         * 显示标准地图级别控制条控件,仅包括:地图级别控制条
         */
        showStandMapControl: function() {},

        /**
         * 隐藏地图级别控制条
         */
        hideMapControl: function() {},

        /**
         * 地图放大一级
         */
        zoomIn: function() {},

        /**
         * 地图缩小一级
         */
        zoomOut: function() {},

        /**
         * 地图缩放到指定级别
         * @param  {Number} zoomLevel - 地图级别
         */
        zoomTo: function(zoomLevel) {},

        /**
         * 地图按照动画的方式缩放到指定级别
         * @param  {Number} zoomLevel - 地图级别
         * @param  {Object} options - 动画参数设置
         * @param  {Number} options.duration=2000 - 动画持续时间
         * @param  {String} options.easing - 动画缓动函数方式,具体值参考CSS3
         */
        zoomAnimationTo: function(zoomLevel, options) {},

        /**
         * 清除所有加载到地图上的要素,包括:叠加要素以及Dom元素
         */
        clear: function() {},

        /**
         * 在地图窗口中使用像素坐标检测叠加要素.然后,执行回调方法,回调返回真值将停止检测
         * @param  {Number[]}  pixel - 像素坐标 
         * @param  {Function} fn - 检测到要素时候执行的回调方法,
         * @param  {EzOverlay} fn.fearture - 检测到的要素对象
         * @param  {scope}  [opts_this] - 回调方法执行的作用域
         */
        forEachFeatureAtPixel: function(pixel, fn, opts_this) {},

        /**
         * 使用像素坐标检测是否有叠加要素  
         * @param  {Number[]}  pixel - 像素坐标
         * @return {Boolean}  是否有要素
         */
        hasFeatureAtPixel: function(pixel) {},

        /**
         * 像素距离转大地距离
         * @param {Number} pdistance
         * @return {Number}
         */
        pixeldistance2KMdistance: function(pdistance) {},

        /**
         * 使得可拖拽元素能够在地图上实现拖拽交互
         */
        draggable: function() {},

        /**
         * 关闭拖拽交互
         */
        disdraggable: function() {},

        /**
         * 增加地图比例尺
         * @param {Object} options 相关参数
         */
        addScaleLineControl: function(options) {},


        /**
         * 从地图上删除地图比例尺控件
         */
        removeScaleLineControl: function() {},

        /**
         * 增加鹰眼地图控件
         * @param {Object} options 相关参数
         */
        addOverviewControl: function(options) {},

        /**
         * 从地图上移除鹰眼地图控件
         */
        removeOverviewControl: function() {},

        /**
         * 显示地图图层控件，控件类型支持：普通型和简约型('simple')
         * @example
         *  // 普通型
         *  map.showLayersControl();
         *  // 简约型
         *  map.showLayersControl(function(layerInfo,type){
         *      layerInfo[0].imageSRC = '/images/layer_yingxiang.png';
                layerInfo[1].imageSRC = '/images/layer_shiliang.png';
                return {
                    layerInfo: layerInfo,
                    type: 'simple'
                };
         *  });
         * 
         * @param  {Function} [fn] 自定义类型配置参数
         */
        showLayersControl: function(fn) {},

        /**
         * 隐藏地图图层控件
         */
        hideLayersControl: function() {},

        /**
         * 显示地图比例尺控件
         */
        showScaleControl: function() {},

        /**
         * 隐藏地图比例尺控件
         */
        hideScaleControl: function() {},

        /**
         * 显示地图鹰眼控件
         */
        showOverviewControl: function() {},

        /**
         * 隐藏地图鹰眼控件
         */
        hideOverviewControl: function() {},

        /**
         * 获取地图指定容器像素坐标的地理坐标
         * @param  {Number[]} pixel 像素坐标
         * @return {Number[]}  地理坐标数组
         */
        getCoordinateFromPixel: function(pixel) {},

        /**
         * 获取地图指定地理坐标的容器像素坐标
         * @param  {Number[]} coord 地理坐标数组
         * @return {Number[]}       像素坐标
         */
        getPixelFromCoordinate: function(coord) {},

        /**
         * 显示地图的简易版地图缩放控件
         */
        showSimpleZoomControl: function() {},

        /**
         * 隐藏地图的简易版地图缩放控件
         */
        hideSimpleZoomControl: function() {}
    };
