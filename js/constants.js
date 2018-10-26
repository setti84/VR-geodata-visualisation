
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;

const ZOOMLEVEL = 19; // 19
const SCALEFACTOR = 1;
const MOVINGFACTOR = 1000; // normal is 65
const CAMERAHEIGHT = 10; // 100
const LOADING_TILE_DISTANCE = 500; //in meter 500
const CALCULATE_TILE_DISTANCE = 3; // Amount of tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7

// const EARTH_CIRCUMFERENCE_IN_METERS = EARTH_RADIUS_IN_METERS * Math.PI * 2;
// const METERS_PER_DEGREE_LATITUDE = EARTH_RADIUS_IN_METERS * Math.PI * 2 / 360;
// const METERS_PER_DEGREE_LONGITUDE = EARTH_RADIUS_IN_METERS * Math.PI * 2 / 360;