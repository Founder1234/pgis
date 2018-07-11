exports.deps = {
    OL3_DEBUG: {
        src: ['LIB:ol-debug.js'],
        desc: 'unpressed OL3 lib'
    },
    OL3_EXTEND: {
        src: [
            'OLextend/mappane.js',
            'OLextend/format/hotspotformat.js',
            'OLextend/format/clusterhotspotformat.js',
            // 'OLextend/format/hotspottileformat.js',
            'OLextend/source/hotspot.js',
            'OLextend/source/vectorsource2.js',
            'OLextend/source/singlehotspotsource.js',
            // 'OLextend/source/singlehotspottilesource.js',
            'OLextend/source/ezMap2010source.js',
            'OLextend/source/clusterToEz.js',
            'OLextend/interaction/clickinteraction.js',
            'OLextend/interaction/draw2interaction.js',
            'OLextend/interaction/modify2interaction.js',
            'OLextend/interaction/dragfeature.js'
        ],
        desc: 'extend ol3 classes'
    },
    License: {
        src: ['license.js'],
        desc: '客户端启动'
    },
    Coordinates: {
        src: ['coordinate.js'],
        desc: 'Ez Coordinates'
    },
    EventType: {
        src: ['event.js'],
        desc: 'Events type'
    },
    Overlay: {
        src: ['overlay.js'],
        desc: 'Ez.Overlay'
    },
    Icon: {
        src: ['icon.js'],
        desc: 'Ez.Icon'
    },
    Marker: {
        src: ['marker.js'],
        desc: 'Ez.Marker'
    },
    TileLayer: {
        src: [
            // 'TileLayer/tileLayer.js',
            // 'TileLayer/ezmap2010.js',
            // 'TileLayer/ezmap2010Local.js',
            // 'TileLayer/hotspot.js',
            // 'TileLayer/singlehotspot.js',
            // 'TileLayer/multihotspot.js',
            //'TileLayer/heatmap.js'
        ],
        desc: 'Tile Layer Class'
    },
    Layers: {
        src: ['layers/grouplayer.js',
            'layers/heatmaplayer.js',
            'layers/imageWMS.js',
            'layers/clusterlayer.js'
        ],
        desc: 'Layer Class'
    },
    TileLayers: {
        src: ['tilelayers/tilelayer.js',
            'tilelayers/tdttilelayer.js',
            'tilelayers/wmtslayer.js',
            'tilelayers/xyztilelayer.js',
            'tilelayers/ezmap2010tilelayer.js',
            'tilelayers/ezmap2010projtilelayer.js',
            // 'tilelayers/hotspottilelayer.js',
            'tilelayers/singlehotspottilelayer.js',
            'tilelayers/multihotspottilelayer.js',
            // 'tilelayers/singlehotspottilevector.js',
            'tilelayers/gdtilelayer.js'
        ],
        desc: '重构整个图层对象'
    },
    MBR: {
        src: ['mbr.js'],
        desc: 'MBR object'
    },
    Geometry: {
        src: ['g/Point.js',
            'g/Polyline.js',
            'g/Polygon.js',
            'g/Circle.js',
            'g/Rectangle.js'
        ],
        desc: 'Geomtry Object'
    },
    Controls: {
        src: ['control/layers.js',
            'control/navigationbar.js',
            'control/zoomslider.js',
            'control/scaleline.js',
            'control/overview.js',
            'control/simpleZoom.js',
            'control/simpleLayers.js',
            'control/attr.js'
        ],
        desc: 'Control extend'
    },
    Utility: {
        src: ['utility/measure.js'],
        desc: 'utility for measure'
    },
    Global: {
        src: ['global.js'],
        desc: 'Global JS'
    },
    Map: {
        src: ['map.js'],
        desc: 'EzMap Object'
    },
    Popup: {
        src: ['htmlelementoverlay.js',
            'popup2.js'
        ],
        desc: 'Popup'
    },
    Title: {
        src: ['title.js'],
        desc: 'Title'
    },
    Animation: {
        src: ['animations/interopfn.js',
            'animations/transition.js',
            'animations/translate.js',
            'animations/rotate.js',
            'animations/compose.js',
            'animations/sequence.js',
            'animations/parallel.js'
        ],
        desc: '合成动画控制器'
    }
};
