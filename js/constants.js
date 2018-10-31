
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
const DEBUGGING = false;

const SCALEFACTOR = 1;
const MOVINGFACTOR = 1500; // normal is 65
const CAMERAHEIGHT = 420; // 100
const LOADING_TILE_DISTANCE = 1500; //in meter 500
const CALCULATE_TILE_DISTANCE = 3; // Amount of tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7