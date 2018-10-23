
const TILE_SIZE = 256;
const ZOOMLEVEL = 19;
const SCALEFACTOR = 1;
const MOVINGFACTOR = 2;

const EARTH_RADIUS_IN_METERS = 6378137;
const EARTH_CIRCUMFERENCE_IN_METERS = EARTH_RADIUS_IN_METERS * Math.PI * 2;
const METERS_PER_DEGREE_LATITUDE = EARTH_RADIUS_IN_METERS * Math.PI * 2 / 360;
const METERS_PER_DEGREE_LONGITUDE = EARTH_RADIUS_IN_METERS * Math.PI * 2 / 360;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;