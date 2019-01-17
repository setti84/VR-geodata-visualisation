
const TILE_SIZE = 256;
const EARTH_RADIUS_IN_METERS = 6378137;
const ORIGINSHIFT = 2*Math.PI*EARTH_RADIUS_IN_METERS/2;
// const DEBUGGING = true;
const OSMB_TILE_ZOOM = 17;
const CAMERA_MAX_FAR = 12000000; // 12000000
const CAMERA_NEAR =1;


const CAMERA_MAX_HEIGHT = 1000;
const CAMERA_MIN_HEIGHT = 1;
let SCALEFACTOR = 1; //0.015625;
const CAMERAHEIGHT = 500; // 100
const LOADING_TILE_DISTANCE = 1000; //in meter 500
const CALCULATE_TILE_DISTANCE =9; // 30 // Amount of  tiles get loaded around the origin, only use positive uneven numbers e.g. 3,5 or 7