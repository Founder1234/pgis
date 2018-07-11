/**
 * 热力图层类
 * @example
 * //获取数据，可以AJAX，亦或是本地。最后...
 * var renderData = [...数据是放在这里的，json格式];
 * //构建注册参数列表用于构建自定义的热力图
 * var config = {
 *  radius: 50,//缺省是8
 *  xField: 'lng',//这个必须指定，对应上述数据json对象中的经度KEY
 *  yField: 'lat',//这个必须指定，对应上述数据json对象中的纬度KEY
 *  valueField: 'count'//这个必须指定，对应上述数据json对象中的属性KEY
 *  ...
 * };
 * //构建热力图对象
 * var heatmap = new EzLayerHeatMap(config);
 * //增加到地图上
 * map.addOverlay(heatmap);
 * //添加渲染数据
 * heatmap.addData(renderData);
 * //这时地图上生成热力图
 *
 * @constructor
 * @param {Object} configOpts - 热力图相关配置参数
 * @param {Number | undefined} configOpts.radius=8 - 要素的影响半径大小，单位是pixel
 * @param {Number | undefined} configOpts.blur=15 - 要素的影响模糊半径大小，单位是pixel
 * @param {Number | undefined} configOpts.shadow=250 - 要素的阴影半径大小，单位是pixel
 * @param {String | Function} configOpts.weight='weight' - 用于使用的要素权重值属性或者一个返回要素权重值的函数，值域为0~1
 * @param {Number | undefined} configOpts.opacity=1 - 图层透明度
 * @param {EzMBR | undefined} configOpts.extent - 图层的渲染包络框，缺省为没有边界限制
 * @param {String} configOpts.xField - X值的标识
 * @param {String} configOpts.yField - Y值的标识
 * @param {String} configOpts.valueField - value值的标识
 * @param {String[] | undefined} configOpts.gradient - 热力图的颜色梯度数组，默认为['#00f', '#0ff', '#0f0', '#ff0', '#f00']
 */
var EzLayerHeatMap = function(configOpts) {};

EzLayerHeatMap.prototype =
    /** @lends EzLayerHeatMap.prototype */
    {
        /**
         * 显示热力图
         */
        show: function() {},

        /**
         * 隐藏热力图,但是保留在内存中，可以通过{@link EzLayerHeatMap#show}方法来显示
         */
        hide: function() {},

        /**
         * 增加数据然后渲染
         * @param {Object[]} data - 用于绘制热力图的点数据集
         */
        addData: function(renderData) {}
    };
