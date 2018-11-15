// var Util = {
//
// }

const util = function(){

  const wgs2MercX = (lng) => {
    // OSM version
    //"Converts given lon in WGS84 Datum to X in Spherical Mercator EPSG:900913"
    return lng * ORIGINSHIFT / 180;
  }

  const wgs2MercY = (lat) => {
    // OSM version
    //"Converts given lat in WGS84 Datum to Y in Spherical Mercator EPSG:900913"
    const y = Math.log( Math.tan((90 + lat) * Math.PI / 360 )) / (Math.PI / 180);

    return y * ORIGINSHIFT / 180;
  }

  const clamp = (num, min, max) => {
    return Math.min(Math.max(min, num), max);
  };

  return{
    wgs2MercX: wgs2MercX,
    wgs2MercY: wgs2MercY,
    clamp : clamp
  }

}();