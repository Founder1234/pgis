angular.module('ezServerClientV71ApidocApp', [])
    .controller('DemosController', ['$scope', function($scope) {
        var data = [{
            "id": 1,
            "title": "Simple Map",
            "html": "simple.html",
            "tags": "EzMap",
            "desc": "最简单的地图,用于WEB地图展示"
        }, {
            "id": 2,
            "title": "Center To",
            "html": "centerto.html",
            "tags": "EzMap center-functions",
            "desc": "基于坐标点、包络框等定位地图中心方式"
        }, {
            "id": 3,
            "title": "Animate To",
            "html": "animateto.html",
            "tags": "EzMap animateto-function",
            "desc": "动态定位方式：平移、飞入、旋转等"
        }, {
            "id": 4,
            "title": "Zoom Animate",
            "html": "zoomanimate.html",
            "tags": "EzMap zoomAnimateto-function",
            "desc": "动态zoom动画，类似摄像机伸缩镜头感觉"
        }, {
            "id": 5,
            "title": "Zoom Map",
            "html": "zoom.html",
            "tags": "EzMap zoomIn zoomOut zoomTo",
            "desc": "普通的地图级别操作"
        }, {
            "id": 6,
            "title": "Controls",
            "html": "controls.html",
            "tags": "EzMap EzControls",
            "desc": "地图控件，用于操作WEB地图"
        }, {
            "id": 7,
            "title": "Dynamic Draw",
            "html": "draw.html",
            "tags": "EzMap changeDragMode",
            "desc": "地图动态绘图方法接口"
        }, {
            "id": 8,
            "title": "Add Features",
            "html": "features.html",
            "tags": "EzMap Ez.g.* Getter Setter",
            "desc": "通过矢量叠加要素类生成矢量图形"
        }, {
            "id": 9,
            "title": "Buildin Marker",
            "html": "marker.html",
            "tags": "EzMarker Function",
            "desc": "添加内置的marker要素"
        }, {
            "id": 10,
            "title": "Custom Marker",
            "html": "custommarker.html",
            "tags": "EzMarker EzIcon Function",
            "desc": "添加自定义的marker要素"
        }, {
            "id": 11,
            "title": "Popup Demo",
            "html": "popup.html",
            "tags": "EzMarker EzPopup Function",
            "desc": "添加EzPopup,并通过不同的方式打开"
        }, {
            "id": 12,
            "title": "Title Demo",
            "html": "title.html",
            "tags": "EzMarker EzTitle Function",
            "desc": "添加EzTitle,自定义样式,打开"
        }, {
            "id": 13,
            "title": "HTMLElementOverlay Show",
            "html": "htmlelementoverlay.html",
            "tags": "HTMLElementOverlay Dom Function",
            "desc": "自定义HTMLElementOverlay样式,添加到地图"
        }, {
            "id": 14,
            "title": "MapEvent Show",
            "html": "mapevent.html",
            "tags": "MapEvent addMapEventListener Function",
            "desc": "地图事件处理方法"
        }, {
            "id": 15,
            "title": "Interaction Popup",
            "html": "interactpopup.html",
            "tags": "MapEvent addMapEventListener Popup",
            "desc": "交互的Popup"
        }];

        var examplesBy3 = [];
        var examplesWith3;
        for (var i = 0; i < data.length; i++) {
            if (i % 3 === 0) {
                if (i !== 0) {
                    examplesBy3.push(examplesWith3);
                }
                examplesWith3 = [];
                examplesWith3.push(data[i]);
            } else {
                examplesWith3.push(data[i]);
            }

            if (data.length <= 3 || i === data.length - 1) {
                examplesBy3.push(examplesWith3);
            }
        }

        $scope.examples = examplesBy3;
    }]);
