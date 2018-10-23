var Util = {

  tile2long: function (x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
  },

  tile2lat: function (y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
  },

  getTileSizeInMeters(latitude, zoom) {
    return EARTH_RADIUS_IN_METERS * Math.PI * 2 * Math.cos(latitude / 180 * Math.PI) /
      Math.pow(2, zoom);
  },

  unprojectWorldCoordinates(x, y) {
    // "Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum"
    const lng = (x / ORIGINSHIFT) * 180;
    let lat = (y / ORIGINSHIFT) * 180;
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
    return [lat, lng]
  },

  coords2Tile (lng, lat ,zoom) {
    // OSM Buildings
    // lng,lat aka x,y
    return [ (Math.floor((lng+180)/360*Math.pow(2,zoom))),
      (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)))]
  }

}

