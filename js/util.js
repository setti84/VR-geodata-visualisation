// var Util = {
//
// }

const util = function(){

  // var current = null;

  // function wgs2Mercator (lng, lat) {
  //     // OSM version
  //     //"Converts given lat/lon in WGS84 Datum to XY in Spherical Mercator EPSG:900913"
  //     const x = lng * ORIGINSHIFT / 180;
  //     let y = Math.log( Math.tan((90 + lat) * Math.PI / 360 )) / (Math.PI / 180);
  //     y = y * ORIGINSHIFT / 180;
  //
  //   return [x,y];
  // }

  function wgs2MercX (lng) {
    // OSM version
    //"Converts given lon in WGS84 Datum to X in Spherical Mercator EPSG:900913"
    return lng * ORIGINSHIFT / 180;
  }

  function wgs2MercY (lat) {
    // OSM version
    //"Converts given lat in WGS84 Datum to Y in Spherical Mercator EPSG:900913"
    const y = Math.log( Math.tan((90 + lat) * Math.PI / 360 )) / (Math.PI / 180);

    return y * ORIGINSHIFT / 180;
  }

  return{
    wgs2MercX: wgs2MercX,
    wgs2MercY: wgs2MercY
  }

}();