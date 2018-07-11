/*
|------------------------------------------------------------------------------
|                                Ez.controls.Overview                
|
|@author: qianleyi
|@date: 2016-08-02
|@descript: 地图鹰眼控件类
|------------------------------------------------------------------------------
*/
goog.provide('Ez.controls.Overview');

goog.require('ol.control.OverviewMap');

/**
 * 鹰眼地图类
 * @param {[type]} options [description]
 */
Ez.controls.Overview = function(options) {
    var opts = options ? options : {};

    var className = opts.className ? opts.className : 'ol-overviewmap ez-custom-overview';

    var collapseLabel = opts.collapseLabel ? opts.collapseLabel : '\u00BB';

    var label = opts.label ? opts.label : '\u00AB';

    var collapsed = opts.collapsed ? opts.collapsed : true;

    var prjection = opts.projection ? opts.projection : 'EPSG:4326';

    goog.base(this, {
        className: className,
        collapseLabel: collapseLabel,
        label: label,
        view: new ol.View({
            projection: prjection
        }),
        collapsed: collapsed
    });
};
goog.inherits(Ez.controls.Overview, ol.control.OverviewMap);
