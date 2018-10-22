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

  // tileBounds(tile, zoom){
  //   // tile = [tx, ty] tilecoordinates in google Proj
  //   // "Returns bounds of the given tile in EPSG:900913 coordinates"
  //   const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(2**zoom);
  //
  //   const minX = tile[0]*TILE_SIZE*res-ORIGINSHIFT;
  //   const minY = tile[1]*TILE_SIZE*res-ORIGINSHIFT;
  //   const maxX = (tile[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
  //   const maxY = (tile[1]+1)*TILE_SIZE*res-ORIGINSHIFT;
  //
  //   return{minX: minX,maxX: maxX, minY: minY, maxY: maxY}
  // },






}

