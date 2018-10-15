var Util = {

  EARTH_RADIUS_IN_METERS: 6378137,
  EARTH_CIRCUMFERENCE_IN_METERS: 6378137 * Math.PI * 2,

  METERS_PER_DEGREE_LATITUDE: 6378137 * Math.PI * 2 / 360,
  METERS_PER_DEGREE_LONGITUDE: 6378137 * Math.PI * 2 / 360,

  calcPos: function(position) {
    // console.log(position)
    console.log(this.EARTH_CIRCUMFERENCE_IN_METERS)

  },

  long2tile: function (lon,zoom) {

    return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
    },

  lat2tile: function (lat,zoom)  {

    return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
    },

  tile2long: function (x,z) {
  return (x/Math.pow(2,z)*360-180);
  },

  tile2lat: function (y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
  },

  getTileSizeInMeters( latitude, zoom) {
    return 6378137 * Math.PI * 2 * Math.cos(latitude / 180 * Math.PI) /
      Math.pow(2, zoom);
  }

}
