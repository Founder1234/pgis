/*
|------------------------------------------------------------------------------
|                                   EzMapAPI.js
|
|@author: qianleyi
|@date: 2015-11-27
|@descript: 基础地图初始化配置设置
|------------------------------------------------------------------------------
*/

var ezMap = {
    /**
     * 二维数组：可以插入多个图层对象
     * 参数说明：[]表示图层组,数组中[i][0]表示图层名,[i][1]表示图层的URL,[i][2]表示图层的参数设置
     * 参数类型：Array
     * 取值范围：无限制
     * 默认值：无
     */
    MapSrcURL: [
        /** 最上层图层 */
        //-------------------------------------
        //Geog2010 格式模板
        // ["公司2010格式地图(大地坐标投影)", "http://172.25.18.16:8081/EzServer7/Maps/Blue", {
        //     crs: '4326',
        //     imageSRC: '../images/shiliang.png'
        // }],
        //-------------------------------------
        //GeogTdt 格式模板
        // ["天地图格式(大地坐标投影)", "http://172.18.68.248:8080/Server7/Maps/D_441900DG", {
        //     crs: '4326',
        //     wrapX: false,
        //     imageSRC: 'http://172.18.71.80:8080/images/shiliang.png',
        //     key: 'text'
        // }],
        ['TDT', 'http://172.25.16.106:8080/EzServer/Maps/sltdt', {
            crs: '4326',
            wrapX: false,
            imageSRC: '/images/shiliang.png'
        }],
        //-------------------------------------
        // WMTS模板
        // ["wmts", "http://172.25.16.106:8080/EzServer7/WMTS", {
        //     type: 'wmts',
        //     crs: '4326',
        //     wrapX: false,
        //     layer: 'arcgissl12',
        //     matrixSet: 'csss',
        //     format: 'tilessssssssss',
        //     style: 'default',
        //     imageSRC: 'http://172.18.71.80:8080/images/shiliang.png',
        //     customOpts: {
        //         isTDT: true,
        //         print: true,
        //         layers: "arcgissl12"
        //     }
        // }],
        //-------------------------------------
        // Group模板
        // ["group", "http://t0.tianditu.com/vec_c/wmts", {
        //     type: 'group',
        //     subType: 'wmts',
        //     crs: '4326',
        //     wrapX: false,
        //     imageSRC: '/images/shiliang.png',
        //     subLayer: ["http://t0.tianditu.com/cva_c/wmts", {
        //         layer: 'cva',
        //         matrixSet: 'c',
        //         format: 'tiles',
        //         style: 'default',
        //         wrapX: false
        //     }],
        //     layer: 'vec',
        //     matrixSet: 'c',
        //     format: 'tiles',
        //     style: 'default'
        // }],
        //-------------------------------------
        //proj2010(公司加密格式投影) 格式模板
        // ["公司加密格式(大地坐标投影)", "http://172.25.18.113:7001/EzServer/Maps/K2For2010", {
        //     crs: '3857',
        //     type: 'EzMap2010Local',
        //     imageSRC: '../images/shiliang.png'
        // }],
        /** 第二层图层 */
        ["YX", "http://172.25.16.106:8080/EzServer/Maps/yxTDT", {
            crs: '4326',
            wrapX: false,
            imageSRC: '/images/yingxiang.png'
        }]
        /** ... */
    ],

    /**
     * 参数说明：设置地图初始化中心位置
     * 参数类型：Array<Float,Float>
     * 取值范围：无限制
     * 默认值：无
     */
    //CenterPoint: [104.114129,37.550339],
    CenterPoint: [116.40981269836427, 39.896639704704288],
    // CenterPoint: [106.7054, 26.8419],
    // CenterPoint: [492567.23876, 326339.30273],

    /**
     * 参数说明：设置全图显示时地图显示范围
     * 参数类型：[minx,miny,maxx,maxy]
     * 取值范围：无限制
     * 默认值：无
     */
    MapFullExtent: undefined,
    //MapFullExtent: [116.264129,39.590339,116.564129,39.79],

    /**
     * 参数说明：设置地图初始显示级别
     * 参数类型：Int
     * 取值范围：无限制
     * 默认值：无
     */
    MapInitLevel: 11,

    /**
     * 参数说明：设置地图显示的最大级别
     * 参数类型：Int
     * 取值范围：无限制
     * 默认值：无
     */
    MapMaxLevel: 20,

    /**
     * 参数说明：设置地图显示的最小级别
     * 参数类型：Int
     * 取值范围：无限制
     * 默认值：无
     */
    MapMinLevel: 2,

    /**
     * 参数说明：是否添加地图级别控制条hover样式
     * 参数类型：Boolean
     * 取值范围：无限制
     * 默认值：无
     */
    isTitleArea: true,

    /**
     * 参数说明：Animation 瓦片是否提前加载
     * 参数类型：Boolean
     * 取值范围：无限制
     * 默认值：false
     */
    loadTilesWhileAnimating: false
};

(function(ezMap) {
    var scriptName = "EzMapAPI\\.js";
    var keyWord = "key";

    (function(ezMap) {
        var isOL = new RegExp("(^|(.*?\\/))(" + scriptName + ")(\\?|$)");
        var scripts = document.getElementsByTagName('script');
        for (var i = 0, len = scripts.length; i < len; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                var match = src.match(isOL);
                if (match) {
                    var key = src.indexOf(keyWord + "=");
                    if (key == -1) {
                        break;
                    }
                    var get_par = src.slice(keyWord.length + key + 1);
                    var nextPar = get_par.indexOf("&");
                    if (nextPar != -1) {
                        get_par = get_par.slice(0, nextPar);
                    }
                    ezMap.AuthorKey = get_par;
                    break;
                }
            }
        }
    })(ezMap);
})(ezMap);
