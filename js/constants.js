
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
const DEBUGGING = false;

const ZOOMLEVEL = 18; // 19
const SCALEFACTOR = 1;
const MOVINGFACTOR = 2200; // normal is 65
const CAMERAHEIGHT = 220; // 100
const LOADING_TILE_DISTANCE = 1500; //in meter 500
const CALCULATE_TILE_DISTANCE = 21; // Amount of tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7