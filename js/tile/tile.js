class Tile {
  constructor (origin, coords) {
    this.origin = origin;
    this.tileCoords = coords;
    this.isLoaded = false;
    this.isLoading = false;
    this.distanceToOrigin = 100; // random value set
    this.threeScene = document.querySelector('a-scene').object3D;  // THREE.Scene

  }

  tileBounds(){
    // tile = [tx, ty] = tilecoordinates
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.origin.zoom));

    const minX = this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT;
    const maxX = (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
    const minY = this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT;
    const maxY = (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT;

    return [minX, maxX, minY, maxY];

  }
}