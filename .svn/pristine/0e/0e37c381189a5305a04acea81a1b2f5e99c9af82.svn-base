/*
|------------------------------------------------------------------------------
|                                ol.format.HotSpotCluster                
|
|@author: qian_leyi
|@date: 2017-06-28
|@descript: 使用聚合图标实现热点POI展示
|------------------------------------------------------------------------------
*/
goog.provide('ol.format.HotSpotCluster');

goog.require('ol.format.TextFeature');

/**
 * HotSpot的文本数据格式，类中自带其数据解析功能
 * @param {string} type
 * @param {Ez.Icon} icon
 * 
 * @constructor
 * @extends {ol.format.TextFeature}
 */
ol.format.HotSpotCluster = function(type, icon, clusterStyle, icongroup, clusterKeyName) {
    goog.base(this);

    this.type_ = type;
    this.icon_ = icon;
    this.clusterstyle_ = clusterStyle;
    this.icongroup = icongroup;
    this.clusterKeyName = clusterKeyName;
};
goog.inherits(ol.format.HotSpotCluster, ol.format.TextFeature);


ol.format.HotSpotCluster.prototype.readFeatureFromText = function(text) {
    return [];
};

/**
 * 从文本中读取要素
 * @param  {String} text 
 * @return {Array}
 */
ol.format.HotSpotCluster.prototype.readFeaturesFromText = function(text) {

    var coords,
        object,
        feature,
        type,
        icon,
        features = [];

    var objects = text.split("\r\n");

    if (this.icon_) {
        icon = this.icon_;
    }

    var type = this.type_.trim();

    var title,
        customs;

    for (var i = 0; i < objects.length; i++) {
        if (objects[i] && objects[i].length > 0) {
            object = JSON.parse(objects[i]);
            coords = new Ez.Coordinate(object.X, object.Y);
            result = this.matchType(type, object);

            if (result === null) {
                new Error("输入的数据格式不正确！无法解析");
            }

            var marker = new Ez.Marker(coords, icon, result.title);
            if (result.weight > 1) {
                marker.setStyle(this.calStyle(result.weight));
            } else {
                if (result.videoDire && result.videoType && result.status) {
                    marker.setIcon(this.getMarkerStyle(result.videoType, result.videoDire, result.status));
                }
            }
            marker.setId(object.ID);
            marker.set('type_name', 'hotspot');
            marker.set('nativeObject', object);
            for (var keyval in result) {
                if (keyval !== "title") {
                    marker.set(keyval, result[keyval]);
                }
            }
            features.push(marker);
        }
    }
    return features;
};

ol.format.HotSpotCluster.prototype.getMarkerStyle = function(type, direct, status) {
    var directDict = {
        '东': 0,
        '南': 90,
        '西': 180,
        '北': 270
    };
    var icongroup = this.icongroup;
    var directNew = directDict[direct];

    var icon = icongroup[type];

    if (!icon) new Error('该类型不在你定义的图标集合中');

    var iconOptions = icon.getOptions();
    var srcPath = iconOptions.src;
    var srcPathNew = srcPath;
    if (parseInt(status) === 0) {
        srcPathNew = srcPath.substring(0, srcPath.lastIndexOf('.')) + '_no' + srcPath.substring(srcPath.lastIndexOf('.'));
    }

    var iconOptionsNew = Object.assign({}, iconOptions, { src: srcPathNew, rotation: directNew });
    return new EzIcon(iconOptionsNew);
};

ol.format.HotSpotCluster.prototype.calStyle = function(size) {
    var opts = this.clusterstyle_,
        threshold = opts.threshold,
        colors = opts.thresholdColor;

    for (var i = threshold.length - 1; i >= 0; i--) {
        if (size >= threshold[i]) {
            return this.calClusterStyle(size, colors[i]);
        }
    }

    return this.calClusterStyle(size);
};

ol.format.HotSpotCluster.prototype.calClusterStyle = function(text, color) {
    var opts = this.clusterstyle_;
    var fill = goog.isDef(opts.fill) ? opts.fill : '#7A9DF6',
        stroke = goog.isDef(opts.stroke) ? opts.stroke : '#fff',
        textFill = goog.isDef(opts.textFill) ? opts.textFill : '#fff',
        radius = goog.isDef(opts.radius) ? opts.radius : 15;

    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: color || fill
            }),
            stroke: new ol.style.Stroke({
                color: stroke
            }),
            radius: radius
        }),
        text: new ol.style.Text({
            fill: new ol.style.Fill({
                color: textFill
            }),
            text: text.toString()
        })
    });
}

ol.format.HotSpotCluster.prototype.readProjection = function() {
    return new ol.proj.get('EPSG:4326');
};

ol.format.HotSpotCluster.prototype.matchType = function(type, object) {
    var typeKeyName = this.clusterKeyName;
    switch (type) {
        case "jsonv1":
            {
                return {
                    title: object.LABEL,
                    weight: object.WEIGHT,
                    bbox: object.BBOX,
                    videoType: object.customs[typeKeyName],
                    status: object.customs.STATUS,
                    videoDire: object.customs.VIDEO_DIRE,
                    customs: object.customs
                }
            }
        case "jsonv1s":
            {
                return {
                    title: object.LABEL,
                    weight: object.WEIGHT,
                    bbox: object.BBOX,
                    videoType: object.customs[typeKeyName],
                    status: object.customs.STATUS,
                    videoDire: object.customs.VIDEO_DIRE,
                }
            }
        case "jsonv2":
            {
                return {
                    title: object.name,
                    weight: object.weight,
                    bbox: object.bbox,
                    address: object.address,
                    layer: object.layer,
                    customs: object.customs
                }
            }
        case "jsonv2s":
            {
                return {
                    title: object.name,
                    weight: object.weight,
                    bbox: object.bbox,
                    address: object.address,
                    layer: object.layer
                }
            }
    }
    return null;
};
