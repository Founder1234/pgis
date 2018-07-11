/*
|------------------------------------------------------------------------------
|                               ol.format.HotSpot               
|
|@author: qianleyi
|@date: 2016.06.01
|@descript: 用于扩展ol.format.TextFeature
|------------------------------------------------------------------------------
*/
goog.provide('ol.format.HotSpot');

goog.require('ol.format.TextFeature');

/**
 * HotSpot的文本数据格式，类中自带其数据解析功能
 * @param {string} type
 * @param {Ez.Icon} icon
 * 
 * @constructor
 * @extends {ol.format.TextFeature}
 */
ol.format.HotSpot = function(type, icon, isScale, scaleFactor) {
    goog.base(this);

    this.type_ = type;
    this.icon_ = icon;
    this.scaleFactor_ = scaleFactor ? scaleFactor : 1;
    this.scale_ = isScale ? isScale : false;
};
goog.inherits(ol.format.HotSpot, ol.format.TextFeature);


ol.format.HotSpot.prototype.readFeatureFromText = function(text) {
    return [];
};

/**
 * 从文本中读取要素
 * @param  {String} text 
 * @return {Array}
 */
ol.format.HotSpot.prototype.readFeaturesFromText = function(text) {

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
            if (this.scale_) {
                var opts = icon.getOptions();
                var newopts = Object.assign({}, opts, { scale: Math.pow(result.weight, 1 / 10) * this.scaleFactor_ });
                icon = new Ez.Icon(newopts);
            }
            var marker = new Ez.Marker(coords, icon, result.title);
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

ol.format.HotSpot.prototype.readProjection = function() {
    return new ol.proj.get('EPSG:4326');
};

ol.format.HotSpot.prototype.matchType = function(type, object) {
    switch (type) {
        case "jsonv1":
            {
                return {
                    title: object.LABEL,
                    weight: object.WEIGHT,
                    bbox: object.BBOX,
                    customs: object.customs
                }
            }
        case "jsonv1s":
            {
                return {
                    title: object.LABEL,
                    weight: object.WEIGHT,
                    bbox: object.BBOX,
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
