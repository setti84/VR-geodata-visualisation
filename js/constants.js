
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
const DEBUGGING = false;


const CAMERA_MAX_HEIGHT = 400;
const CAMERA_MIN_HEIGHT = 1;
let SCALEFACTOR = 1; //0.015625;
const MOVINGFACTOR_KEYBOARD = 500; // normal is 65
const MOVINGFACTOR_MOUSE = 0.4;
const CAMERAHEIGHT = 45; // 100
const CAMERA_DIV = '#camera'
const LOADING_TILE_DISTANCE = 480; //in meter 500
const CALCULATE_TILE_DISTANCE = 9; // Amount of tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7