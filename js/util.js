var Util = {

  calcPos: function(position) {
    // console.log(position)
    console.log(EARTH_CIRCUMFERENCE_IN_METERS)

  },

  tile2long: function (x,z) {
  return (x/Math.pow(2,z)*360-180);
  },

  tile2lat: function (y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
  },

  getTileSizeInMeters( latitude, zoom) {
    return EARTH_RADIUS_IN_METERS * Math.PI * 2 * Math.cos(latitude / 180 * Math.PI) /
      Math.pow(2, zoom);
  },
  unprojectWorldCoordinates (x,y) {
    // "Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum"
    const originShift = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
    const lng = x/originShift*180;
    let lat = y/originShift*180;
    lat = 180/Math.PI * (2 * Math.atan(( Math.exp( lat * Math.PI / 180)) - Math.PI / 2));

    //   FUNKTIONIERT NICHT!!!!!!

    return [lng, lat]
  }




  /*
  def MetersToLatLon(self, mx, my ):
        "Converts XY point from Spherical Mercator EPSG:900913 to lat/lon in WGS84 Datum"

        lon = (mx / self.originShift) * 180.0
        lat = (my / self.originShift) * 180.0

        lat = 180 / math.pi * (2 * math.atan( math.exp( lat * math.pi / 180.0)) - math.pi / 2.0)
        return lat, lon

   */

}
