
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
const DEBUGGING = false;

let SCALEFACTOR = 0.2; //0.015625;
const MOVINGFACTOR = 500; // normal is 65
const CAMERAHEIGHT = 1.6; // 100
const LOADING_TILE_DISTANCE = 480; //in meter 500
const CALCULATE_TILE_DISTANCE = 5; // Amount of tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7